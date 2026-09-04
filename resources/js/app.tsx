import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import { PageProvider, usePage, router } from '@/lib/inertia-compat';
import './i18n';
import './css/app.css';

if (typeof window !== 'undefined') {
    (window as any).Inertia = router;
}

// Pages
import Landing from './pages/landing';
import Dashboard from './pages/dashboard';
import Transfer from './pages/transfer';
import Welcome from './pages/welcome';
import Credits from './pages/credits/index';
import Savings from './pages/savings/index';
import Daret from './pages/daret/index';
import Ai from './pages/ai/index';

const PageWrapper = ({ component: Component }: { component: any }) => {
    const { props } = usePage();
    return <Component {...props} />;
};

const App = () => {
    return (
        <TooltipProvider delayDuration={0}>
            <BrowserRouter>
                <PageProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<PageWrapper component={Landing} />} />
                        <Route path="/welcome" element={<PageWrapper component={Welcome} />} />

                        {/* Authenticated Routes */}
                        <Route element={<AppLayout breadcrumbs={[]} />}>
                            <Route path="/dashboard" element={<PageWrapper component={Dashboard} />} />
                            <Route path="/transfer" element={<PageWrapper component={Transfer} />} />
                            <Route path="/credits" element={<PageWrapper component={Credits} />} />
                            <Route path="/savings" element={<PageWrapper component={Savings} />} />
                            <Route path="/daret" element={<PageWrapper component={Daret} />} />
                            <Route path="/ai" element={<PageWrapper component={Ai} />} />
                        </Route>

                        {/* Auth Routes */}
                        <Route element={<AuthLayout />}>
                            <Route path="/login" element={<div>Login Page</div>} />
                            <Route path="/register" element={<div>Register Page</div>} />
                        </Route>
                    </Routes>
                </PageProvider>
            </BrowserRouter>
            <Toaster />
        </TooltipProvider>
    );
};

const rootElement = document.getElementById('app');
if (rootElement) {
    createRoot(rootElement).render(<App />);
}

initializeTheme();
