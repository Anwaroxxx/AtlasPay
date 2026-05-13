import React, { createContext, useContext, useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import api from './axios';

export const Link = ({ href, children, ...props }: any) => {
    return (
        <RouterLink to={href} {...props}>
            {children}
        </RouterLink>
    );
};

const PageContext = createContext<any>(null);

export const PageProvider = ({ children }: any) => {
    const [props, setProps] = useState({
        auth: { user: null },
        ziggy: {},
    });
    const location = useLocation();

    useEffect(() => {
        // Fetch shared data on mount or location change
        const fetchSharedData = async () => {
            try {
                // If it's a dashboard or similar, fetch props
                // In a real app, you'd fetch from an endpoint that matches the route
                // For now, let's just fetch the user
                const response = await api.get('/api/user');
                setProps(prev => ({ ...prev, auth: { user: response.data } }));
            } catch (e) {
                console.error("Failed to fetch user", e);
            }
        };
        fetchSharedData();
    }, [location.pathname]);

    return (
        <PageContext.Provider value={{ props, url: location.pathname }}>
            {children}
        </PageContext.Provider>
    );
};

export const usePage = () => {
    return useContext(PageContext) || { props: { auth: { user: null } }, url: window.location.pathname };
};

// Compatibility useForm hook
export const Head = ({ title, children }: any) => {
    React.useEffect(() => {
        if (title) document.title = title;
    }, [title]);
    return <>{children}</>;
};

export const useForm = (initialData: any) => {
    const [data, setData] = React.useState(initialData);
    const [errors, setErrors] = React.useState({});
    const [processing, setProcessing] = React.useState(false);

    const post = async (url: string, options: any = {}) => {
        setProcessing(true);
        // Implement API call here
        setProcessing(false);
    };

    return { data, setData, post, errors, processing, wasSuccessful: false, recentlySuccessful: false };
};

export const router = {
    visit: (url: string) => {
        window.location.href = url;
    },
    post: async (url: string, data: any) => {
        // Implement API call
    },
    get: async (url: string) => {
        // Implement API call
    },
    put: async (url: string, data: any) => {},
    delete: async (url: string) => {},
    reload: () => window.location.reload(),
};
