import Footer from "../footer/Footer";
import Header from "../header/Header";

function DefaultLayout({userType, children}){
    return(
        <>
            <Header userType={userType} showNotification ={false}/>
            <main>
                {children}
            </main>
            <Footer/>
        </>
    )
}

export default DefaultLayout;
