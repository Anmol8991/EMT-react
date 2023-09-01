import navigationConfig from "../../../config/navigation.config";
import VerticalSingleMenuItem from "./components/VerticalSingleMenuItem";
import VerticalCollapseMenuItem from "./components/VerticalCollapseMenuItem";

const Sidebar2 = () => {
    const getNavItem = (nav) => {
        if (nav.subMenu.length === 0 && nav.type === "item") {
          return <VerticalSingleMenuItem key={nav.key} nav={nav} />;
        }
    
        if (nav.subMenu.length > 0 && nav.type === "collapse") {
          return <VerticalCollapseMenuItem key={nav.key} nav={nav} />;
        }
      };
  return (
    <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasWithBackdrop" aria-labelledby="offcanvasWithBackdropLabel">
  <div className="offcanvas-header">
    <h5 className="offcanvas-title" id="offcanvasWithBackdropLabel">Offcanvas with backdrop</h5>
    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div className="offcanvas-body">
        {navigationConfig.map((nav) => getNavItem(nav))}
  </div>
</div>
  )
}

export default Sidebar2
