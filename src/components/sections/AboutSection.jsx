import SectionHeading from '../ui/SectionHeading';

/**
 * AboutSection Component:
 * Clean two-column layout on desktop, single-column on mobile.
 * 
 * Eyebrow: ABOUT BLOOD CONNECT KERALA
 * Heading: Connecting People. Saving Lives.
 * Services list:
 * - Emergency Blood Support
 * - Voluntary Donor Network
 * - Rare Blood Group Assistance
 * - Community Support
 */
export default function AboutSection() {
  const services = [
    {
      title: 'Emergency Blood Support',
      desc: 'Rapid voluntary coordination to help patients find compatible blood donors during critical medical emergencies.',
    },
    {
      title: 'Voluntary Donor Network',
      desc: 'An active, selfless community of verified voluntary blood donors ready to respond across all 14 districts of Kerala.',
    },
    {
      title: 'Rare Blood Group Assistance',
      desc: 'Dedicated network coordination for hard-to-find negative and rare blood groups such as O-, AB-, and rare Bombay phenotypes.',
    },
    {
      title: 'Community Support',
      desc: 'Empowering grassroots coordinators, local volunteers, and hospitals to streamline transparent donor connections.',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#F5F5F5]/60 border-t border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Core Narrative */}
          <div className="lg:col-span-5">
            <SectionHeading
              title={'Connecting People.\nSaving Lives.'}
              align="left"
            />

            <div className="mt-8 space-y-4 text-base sm:text-lg text-[#666666] leading-relaxed">
              <p>
                Emergency situations can become difficult when blood is not available at the right time.
              </p>
              <p>
                Blood Connect Kerala is a voluntary support network created to connect people who need blood with individuals willing to donate.
              </p>
              <p>
                Through a community-driven network, we aim to make blood donor coordination simpler and more accessible across Kerala.
              </p>
            </div>
          </div>

          {/* Right Column: Clean Minimal Services Grid/List */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-7 transition-all duration-200 hover:border-[#151515]/20 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-[#D92735]">
                      0{index + 1}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#EAEAEA]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#151515] tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#666666] leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
