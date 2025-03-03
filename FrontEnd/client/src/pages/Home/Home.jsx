import BannerList from "../../components/BannerList";
import ComicList from "../../components/ComicList";
const Home = () => {
  return (
    <div className="container mx-auto my-28 ">
      <BannerList />
      <div className="container px-2 md:px-auto">
        <ComicList type="truyen-moi" title="Truyện Mới" />
        <ComicList type="sap-ra-mat" title="Sắp Ra Mắt" />
        <ComicList type="hoan-thanh" title="Hoàn Thành" />
      </div>
    </div>
  );
};

export default Home;
