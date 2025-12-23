import Layout from "./Layout.jsx";

import AIBuilderPreferences from "./AIBuilderPreferences";

import Activity from "./Activity";

import AddFeatures from "./AddFeatures";

import CreateDesignSystem from "./CreateDesignSystem";

import CreatePage from "./CreatePage";

import DesignComponents from "./DesignComponents";

import DesignReview from "./DesignReview";

import DesignSpacing from "./DesignSpacing";

import DesignSystem from "./DesignSystem";

import DesignSystemSetup from "./DesignSystemSetup";

import DesignSystems from "./DesignSystems";

import DesignTypography from "./DesignTypography";

import DesignWithAura from "./DesignWithAura";

import FlowBuilder from "./FlowBuilder";

import Home from "./Home";

import NewProject from "./NewProject";

import PageDetail from "./PageDetail";

import PageDetails from "./PageDetails";

import PageTesting from "./PageTesting";

import PagesPage from "./Pages";

import PasteCode from "./PasteCode";

import ProjectDetail from "./ProjectDetail";

import ProjectReady from "./ProjectReady";

import ProjectSetup from "./ProjectSetup";

import ProjectTechStack from "./ProjectTechStack";

import Projects from "./Projects";

import ReviewCreatePage from "./ReviewCreatePage";

import Security from "./Security";

import SelectDesignTemplate from "./SelectDesignTemplate";

import Settings from "./Settings";

import Sprint from "./Sprint";

import SprintDetail from "./SprintDetail";

import SprintPlanning from "./SprintPlanning";

import SprintSetup from "./SprintSetup";

import UploadDesign from "./UploadDesign";

import Login from "./Login";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    AIBuilderPreferences: AIBuilderPreferences,
    
    Activity: Activity,
    
    AddFeatures: AddFeatures,
    
    CreateDesignSystem: CreateDesignSystem,
    
    CreatePage: CreatePage,
    
    DesignComponents: DesignComponents,
    
    DesignReview: DesignReview,
    
    DesignSpacing: DesignSpacing,
    
    DesignSystem: DesignSystem,
    
    DesignSystemSetup: DesignSystemSetup,
    
    DesignSystems: DesignSystems,
    
    DesignTypography: DesignTypography,
    
    DesignWithAura: DesignWithAura,
    
    FlowBuilder: FlowBuilder,
    
    Home: Home,
    
    NewProject: NewProject,
    
    PageDetail: PageDetail,
    
    PageDetails: PageDetails,
    
    PageTesting: PageTesting,
    
    Pages: PagesPage,
    
    PasteCode: PasteCode,
    
    ProjectDetail: ProjectDetail,
    
    ProjectReady: ProjectReady,
    
    ProjectSetup: ProjectSetup,
    
    ProjectTechStack: ProjectTechStack,
    
    Projects: Projects,
    
    ReviewCreatePage: ReviewCreatePage,
    
    Security: Security,
    
    SelectDesignTemplate: SelectDesignTemplate,
    
    Settings: Settings,
    
    Sprint: Sprint,
    
    SprintDetail: SprintDetail,
    
    SprintPlanning: SprintPlanning,
    
    SprintSetup: SprintSetup,
    
    UploadDesign: UploadDesign,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Layout wrapper component
function LayoutWrapper({ children }) {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    return <Layout currentPageName={currentPage}>{children}</Layout>;
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    return (
        <Routes>
            {/* Login route - without Layout */}
            <Route path="/login" element={<Login />} />
            
            {/* All other routes - with Layout */}
            <Route path="/" element={<LayoutWrapper><AIBuilderPreferences /></LayoutWrapper>} />
            <Route path="/AIBuilderPreferences" element={<LayoutWrapper><AIBuilderPreferences /></LayoutWrapper>} />
            <Route path="/Activity" element={<LayoutWrapper><Activity /></LayoutWrapper>} />
            <Route path="/AddFeatures" element={<LayoutWrapper><AddFeatures /></LayoutWrapper>} />
            <Route path="/CreateDesignSystem" element={<LayoutWrapper><CreateDesignSystem /></LayoutWrapper>} />
            <Route path="/CreatePage" element={<LayoutWrapper><CreatePage /></LayoutWrapper>} />
            <Route path="/DesignComponents" element={<LayoutWrapper><DesignComponents /></LayoutWrapper>} />
            <Route path="/DesignReview" element={<LayoutWrapper><DesignReview /></LayoutWrapper>} />
            <Route path="/DesignSpacing" element={<LayoutWrapper><DesignSpacing /></LayoutWrapper>} />
            <Route path="/DesignSystem" element={<LayoutWrapper><DesignSystem /></LayoutWrapper>} />
            <Route path="/DesignSystemSetup" element={<LayoutWrapper><DesignSystemSetup /></LayoutWrapper>} />
            <Route path="/DesignSystems" element={<LayoutWrapper><DesignSystems /></LayoutWrapper>} />
            <Route path="/DesignTypography" element={<LayoutWrapper><DesignTypography /></LayoutWrapper>} />
            <Route path="/DesignWithAura" element={<LayoutWrapper><DesignWithAura /></LayoutWrapper>} />
            <Route path="/FlowBuilder" element={<LayoutWrapper><FlowBuilder /></LayoutWrapper>} />
            <Route path="/Home" element={<LayoutWrapper><Home /></LayoutWrapper>} />
            <Route path="/NewProject" element={<LayoutWrapper><NewProject /></LayoutWrapper>} />
            <Route path="/PageDetail" element={<LayoutWrapper><PageDetail /></LayoutWrapper>} />
            <Route path="/PageDetails" element={<LayoutWrapper><PageDetails /></LayoutWrapper>} />
            <Route path="/PageTesting" element={<LayoutWrapper><PageTesting /></LayoutWrapper>} />
            <Route path="/Pages" element={<LayoutWrapper><PagesPage /></LayoutWrapper>} />
            <Route path="/PasteCode" element={<LayoutWrapper><PasteCode /></LayoutWrapper>} />
            <Route path="/ProjectDetail" element={<LayoutWrapper><ProjectDetail /></LayoutWrapper>} />
            <Route path="/ProjectReady" element={<LayoutWrapper><ProjectReady /></LayoutWrapper>} />
            <Route path="/ProjectSetup" element={<LayoutWrapper><ProjectSetup /></LayoutWrapper>} />
            <Route path="/ProjectTechStack" element={<LayoutWrapper><ProjectTechStack /></LayoutWrapper>} />
            <Route path="/Projects" element={<LayoutWrapper><Projects /></LayoutWrapper>} />
            <Route path="/ReviewCreatePage" element={<LayoutWrapper><ReviewCreatePage /></LayoutWrapper>} />
            <Route path="/Security" element={<LayoutWrapper><Security /></LayoutWrapper>} />
            <Route path="/SelectDesignTemplate" element={<LayoutWrapper><SelectDesignTemplate /></LayoutWrapper>} />
            <Route path="/Settings" element={<LayoutWrapper><Settings /></LayoutWrapper>} />
            <Route path="/Sprint" element={<LayoutWrapper><Sprint /></LayoutWrapper>} />
            <Route path="/SprintDetail" element={<LayoutWrapper><SprintDetail /></LayoutWrapper>} />
            <Route path="/SprintPlanning" element={<LayoutWrapper><SprintPlanning /></LayoutWrapper>} />
            <Route path="/SprintSetup" element={<LayoutWrapper><SprintSetup /></LayoutWrapper>} />
            <Route path="/UploadDesign" element={<LayoutWrapper><UploadDesign /></LayoutWrapper>} />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}