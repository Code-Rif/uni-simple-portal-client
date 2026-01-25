import React from "react";
import FellowshipAdminCreate from "../../features/fellowship/FellowshipAdminCreate";
import FellowshipAdminManager from "../../features/fellowship/FellowshipAdminManager";


const AdminFellowshipPage: React.FC = () => {
    return (
        <div>
            <h1>Fellowship Management</h1>
            <div style={{ marginBottom: 40 }}>
                <FellowshipAdminCreate />
            </div>
            <FellowshipAdminManager />
        </div>
    );
};

export default AdminFellowshipPage;
