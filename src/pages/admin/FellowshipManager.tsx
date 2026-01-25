import React from "react";
import FellowshipAdminManager from "../../features/fellowship/FellowshipAdminManager";

const AdminFellowshipManagerPage: React.FC = () => {
    return (
        <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "2rem 0 1.5rem 0", textAlign: "center", letterSpacing: 1 }}>
                Fellowship Management
            </h1>
            <FellowshipAdminManager />
        </div>
    );
};

export default AdminFellowshipManagerPage;
