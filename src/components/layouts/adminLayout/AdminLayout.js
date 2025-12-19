import Footer from "../footer/Footer";
import Header from "../header/Header";

function AdminLayout({ children }) {
  return (
    <>
      <Header userType="admin" showNotification={false} />
      <main style={{ marginTop: '100px', display: 'flex' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

  export default AdminLayout;
