import { Head } from '@inertiajs/react';
import LandingPage from '@/components/LandingPage';

export default function Welcome() {
    return (
        <>
            <Head title="Bank Chafara — Secure Authentication for Modern Teams">
                <meta
                    name="description"
                    content="Bank-grade security with lightning-fast performance. Trusted by thousands of companies worldwide."
                />
            </Head>
            <LandingPage />
        </>
    );
}
