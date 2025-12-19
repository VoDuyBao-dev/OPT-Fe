import Footer from "../footer/Footer";
import Header from "../header/Header";

function TutorLayout({ children }) {
  return (
    <>
      <Header showNavbar={false} userType="tutor" showNotification={false} />
      <main >
        {children}
      </main>
      <Footer />
    </>
  );
}

export default TutorLayout;
