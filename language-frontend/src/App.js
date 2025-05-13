import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    <div>
            <SuccessStats />
            <AboutSection />
            <BlogCTA />
            <CoursesSection />
            <Testimonials />
            <NewsSection />
            <Footer />
    </div>
  );
}

export default App;