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

import Pages from "./Pages";

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
    
    Pages: Pages,
    
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

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<AIBuilderPreferences />} />
                
                
                <Route path="/AIBuilderPreferences" element={<AIBuilderPreferences />} />
                
                <Route path="/Activity" element={<Activity />} />
                
                <Route path="/AddFeatures" element={<AddFeatures />} />
                
                <Route path="/CreateDesignSystem" element={<CreateDesignSystem />} />
                
                <Route path="/CreatePage" element={<CreatePage />} />
                
                <Route path="/DesignComponents" element={<DesignComponents />} />
                
                <Route path="/DesignReview" element={<DesignReview />} />
                
                <Route path="/DesignSpacing" element={<DesignSpacing />} />
                
                <Route path="/DesignSystem" element={<DesignSystem />} />
                
                <Route path="/DesignSystemSetup" element={<DesignSystemSetup />} />
                
                <Route path="/DesignSystems" element={<DesignSystems />} />
                
                <Route path="/DesignTypography" element={<DesignTypography />} />
                
                <Route path="/DesignWithAura" element={<DesignWithAura />} />
                
                <Route path="/FlowBuilder" element={<FlowBuilder />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/NewProject" element={<NewProject />} />
                
                <Route path="/PageDetail" element={<PageDetail />} />
                
                <Route path="/PageDetails" element={<PageDetails />} />
                
                <Route path="/PageTesting" element={<PageTesting />} />
                
                <Route path="/Pages" element={<Pages />} />
                
                <Route path="/PasteCode" element={<PasteCode />} />
                
                <Route path="/ProjectDetail" element={<ProjectDetail />} />
                
                <Route path="/ProjectReady" element={<ProjectReady />} />
                
                <Route path="/ProjectSetup" element={<ProjectSetup />} />
                
                <Route path="/ProjectTechStack" element={<ProjectTechStack />} />
                
                <Route path="/Projects" element={<Projects />} />
                
                <Route path="/ReviewCreatePage" element={<ReviewCreatePage />} />
                
                <Route path="/Security" element={<Security />} />
                
                <Route path="/SelectDesignTemplate" element={<SelectDesignTemplate />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Sprint" element={<Sprint />} />
                
                <Route path="/SprintDetail" element={<SprintDetail />} />
                
                <Route path="/SprintPlanning" element={<SprintPlanning />} />
                
                <Route path="/SprintSetup" element={<SprintSetup />} />
                
                <Route path="/UploadDesign" element={<UploadDesign />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}