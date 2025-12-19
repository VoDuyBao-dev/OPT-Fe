import Banner from "./banner/Banner";
import Bennefits from "./benefits/Bennefits";
import Progress from "./progress/Progress";
import TopTutor from "./topTutor/TopTutor";
import EBookDB from "./books/E-BooksDB";
import CTASection from "./CTAsection/CTASection";
function Dashboard() {
    return ( 
        <div>
            <Banner />
            <Progress />
            <TopTutor />
            <Bennefits />
            <EBookDB />
            <CTASection />
        </div>
     );
}

export default Dashboard;