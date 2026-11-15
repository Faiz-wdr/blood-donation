import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

/**
 * Supabase Edge Function: daily-activity-check
 *
 * Performs a silent, minimal read-only database query against an existing safe
 * table or restricted RPC to keep database connections active and reduce the risk
 * of Supabase Free Plan projects pausing due to inactivity.
 *
 * Security:
 * Requires a pre-shared secret token in the Authorization header (Bearer <CRON_SECRET>)
 * or in the x-cron-secret header, matching the CRON_SECRET configured in Supabase secrets.
 */
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Verify Secret Token
    const expectedSecret =
      Deno.env.get("CRON_SECRET") || Deno.env.get("ACTIVITY_CHECK_SECRET");

    if (!expectedSecret) {
      console.error(
        "[daily-activity-check] Configuration Error: Neither CRON_SECRET nor ACTIVITY_CHECK_SECRET is set in Supabase secrets."
      );
      return new Response(
        JSON.stringify({
          ok: false,
          error:
            "Server configuration error: CRON_SECRET is not configured on this function.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const authHeader = req.headers.get("Authorization");
    const customHeader = req.headers.get("x-cron-secret");

    let providedToken: string | null = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      providedToken = authHeader.slice(7).trim();
    } else if (customHeader) {
      providedToken = customHeader.trim();
    }

    if (!providedToken || providedToken !== expectedSecret) {
      console.warn(
        `[daily-activity-check] Unauthorized attempt rejected from: ${
          req.headers.get("x-forwarded-for") || "unknown"
        }`
      );
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Unauthorized: Invalid or missing secret token.",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Initialize Supabase Client using standard runtime variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "[daily-activity-check] Configuration Error: SUPABASE_URL or API key is missing."
      );
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Server configuration error: Supabase environment variables missing.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // 3. Perform a minimal, genuine read-only query
    const startTime = performance.now();
    let queryName = "rpc:get_public_donor_counts";
    let donorSummary: Record<string, unknown> = {};

    // Attempt calling existing secure RPC get_public_donor_counts()
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "get_public_donor_counts"
    );

    if (!rpcError && rpcData) {
      donorSummary = {
        total_verified: rpcData.total ?? 0,
      };
    } else {
      // Fallback: minimal safe head count query against donors table
      queryName = "table:donors:count";
      const { count, error: tableError } = await supabase
        .from("donors")
        .select("id", { count: "exact", head: true });

      if (tableError) {
        console.error(
          `[daily-activity-check] Database query failed:`,
          tableError
        );
        return new Response(
          JSON.stringify({
            ok: false,
            error: `Database query failed: ${tableError.message}`,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      donorSummary = {
        count: count ?? 0,
      };
    }

    const durationMs = Math.round(performance.now() - startTime);

    console.log(
      `[daily-activity-check] Activity check completed successfully in ${durationMs}ms via ${queryName}.`
    );

    // 4. Return success response
    return new Response(
      JSON.stringify({
        ok: true,
        message: "Daily activity check completed successfully.",
        timestamp: new Date().toISOString(),
        query: queryName,
        duration_ms: durationMs,
        summary: donorSummary,
        status: "healthy",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected internal server error";
    console.error(`[daily-activity-check] Unhandled error:`, err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

