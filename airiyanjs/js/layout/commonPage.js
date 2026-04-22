import { Outlet, useLoaderData } from "react-router-dom";
import { AccessRestriction } from "./security/accessRestriction";
import { Header } from "./sections/header";

export function CommonLayout() {
    const parentData = useLoaderData();
    const { context = {} } = parentData;
    const { businessData, isLoggedIn } = context;
    return (
        <>
            <Header businessData={businessData} isLoggedIn={isLoggedIn} />
            <main className="flex-fill p-1">
                <AccessRestriction businessData={businessData} isLoggedIn={isLoggedIn}>
                    <Outlet context={{ businessData, isLoggedIn }} />
                </AccessRestriction>
            </main>
            <footer className="mt-auto">
                <div className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <div className="container">
                        <div className="col-md-4 d-flex align-items-center">
                            <span className="text-muted">© 2025 Airiyan Tech</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}