import { Twitter, Facebook, Instagram, Youtube, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { apiGet, endpoints, onImgErrorFallback } from "../lib/api";
import type { TeamMember } from "../lib/api";

function OurTeam() {
  const [remoteTeam, setRemoteTeam] = useState<TeamMember[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const items = await apiGet<TeamMember[]>(endpoints.team);
        setRemoteTeam(items.sort((a, b) => a.order - b.order));
      } catch (err) {
        console.warn("Failed to load team members:", err);
      }
    })();
  }, []);

  const teamItems = remoteTeam && remoteTeam.length > 0
    ? remoteTeam.map((m) => ({
        name: m.name,
        role: m.role,
        img: m.image,
        bg: m.bgImage || "/assets/img/bg/team-1-bg-shape.png",
        socials: (m.socials || []).map((s) => ({ icon: null, url: s.url })),
      }))
    : [
      {
        name: "Sathya",
        role: "Expert Chef",
        img: "/assets/img/team/team_1_1.png",
        bg: "/assets/img/bg/team-1-bg-shape.png",
        socials: [
          { icon: <Twitter size={18} />, url: "https://twitter.com/" },
          { icon: <Facebook size={18} />, url: "https://facebook.com/" },
          { icon: <Instagram size={18} />, url: "https://instagram.com/" },
          { icon: <Youtube size={18} />, url: "https://youtube.com/" },
          { icon: <Phone size={18} />, url: "https://whatsapp.com/" },
        ],
      },
      {
        name: "Sai Kiran",
        role: "Expert Chef",
        img: "/assets/img/team/team_1_2.png",
        bg: "/assets/img/bg/team-1-bg-shape.png",
        socials: [
          { icon: <Twitter size={18} />, url: "https://twitter.com/" },
          { icon: <Facebook size={18} />, url: "https://facebook.com/" },
          { icon: <Instagram size={18} />, url: "https://instagram.com/" },
          { icon: <Youtube size={18} />, url: "https://youtube.com/" },
          { icon: <Phone size={18} />, url: "https://whatsapp.com/" },
        ],
      },
      {
        name: "Vikram",
        role: "Expert Chef",
        img: "/assets/img/team/team_1_3.png",
        bg: "/assets/img/bg/team-1-bg-shape.png",
        socials: [
          { icon: <Twitter size={18} />, url: "https://twitter.com/" },
          { icon: <Facebook size={18} />, url: "https://facebook.com/" },
          { icon: <Instagram size={18} />, url: "https://instagram.com/" },
          { icon: <Youtube size={18} />, url: "https://youtube.com/" },
          { icon: <Phone size={18} />, url: "https://whatsapp.com/" },
        ],
      },
      {
        name: "Chef",
        role: "Expert Chef",
        img: "/assets/img/team/team_1_4.png",
        bg: "/assets/img/bg/team-1-bg-shape.png",
        socials: [
          { icon: <Twitter size={18} />, url: "https://twitter.com/" },
          { icon: <Facebook size={18} />, url: "https://facebook.com/" },
          { icon: <Instagram size={18} />, url: "https://instagram.com/" },
          { icon: <Youtube size={18} />, url: "https://youtube.com/" },
          { icon: <Phone size={18} />, url: "https://whatsapp.com/" },
        ],
      },
    ];

  return (
    <div>
      <section className="team-area-1 space-top">
        <div className="container z-index-common">
          <div className="title-area text-center mb-60">
            <span className="sub-title text-anime-style-1">Our Team</span>
            <h2 className="sec-title text-anime-style-2">
              Meet Our <span className="text-theme">Team</span>
            </h2>
          </div>
          <div className="row gy-40 team-1-nth">
            {teamItems.map((member, idx) => (
              <div
                className="col-xl-3 col-lg-6 col-md-6"
                key={member.name + idx}
              >
                <div
                  className="th-team team-card wow fadeinleft"
                  data-wow-delay={`.${2 + idx * 2}s`}
                >
                  <div className="img-wrap">
                    <div className="team-img">
                      <img src={member.img} alt="Team" onError={onImgErrorFallback(member.img || "/assets/img/team/team_1_1.png")} />
                      <img className="team-1-bg-shape" src={member.bg} alt="" onError={onImgErrorFallback(member.bg || "/assets/img/bg/team-1-bg-shape.png")} />
                    </div>
                    <div className="team-social-hover">
                      <div className="th-social">
                        {member.socials.map((social, sidx) => (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={social.url}
                            key={sidx}
                            style={{ marginRight: 8 }}
                          >
                            {social.icon}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="team-card-content">
                    <h3 className="box-title">
                      <a href="team-details.html">{member.name}</a>
                    </h3>
                    <span className="team-desig">{member.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default OurTeam;
