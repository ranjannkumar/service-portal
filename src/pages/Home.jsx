import React from 'react';
import Hero from '../components/Hero';
import BentoGrid from '../components/BentoGrid';
import AboutSection from '../components/AboutSection';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      
      {/* B.Ed Info Video Section */}
      <section style={{ padding: '2rem', background: '#f0f9ff', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ 
            color: 'var(--color-primary)', 
            marginBottom: '1.5rem', 
            fontWeight: '700' 
          }}>
            UP B.Ed Admission Process & Information
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {/* Video 1 */}
            <div style={{ 
              position: 'relative', 
              paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
              height: 0, 
              overflow: 'hidden',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-lg)',
              background: '#000'
            }}>
              <video 
                controls 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%' 
                }}
              >
                <source src="/Bed_info.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video 2 */}
            <div style={{ 
              position: 'relative', 
              paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
              height: 0, 
              overflow: 'hidden',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-lg)',
              background: '#000'
            }}>
              <video 
                controls 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%' 
                }}
              >
                <source src="/Bed_info2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Search/Status Section */}
      <div id="services">
        <BentoGrid />
      </div>

      {/* Director's Message & Video */}
      <AboutSection />

      {/* Location / Shop Front */}
      <section style={{ padding: '2rem', textAlign: 'center', background: '#fff' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          marginBottom: '1.5rem', 
          color: 'var(--color-primary)',
          fontWeight: '700'
        }}>Visit Our Center</h2>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '2rem'
        }}>
          <img 
            src="/shop_front.png" 
            alt="Online Cyber Center Shop Front" 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        </div>

        {/* Additional Shop Images Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {[
            { src: "/shop_banner2.png", alt: "Shop Banner 2" },
            // { src: "/visit.png", alt: "Visit Our Center 1" },
            // { src: "/visit2.png", alt: "Visit Our Center 2" },
            // { src: "/visit3.png.png", alt: "Visit Our Center 3" }
          ].map((img, index) => (
            <div key={index} style={{ 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow-md)',
              height: '200px'
            }}>
              <img 
                src={img.src} 
                alt={img.alt} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block' 
                }} 
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
