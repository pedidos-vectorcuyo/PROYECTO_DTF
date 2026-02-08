
import React from 'react';

const DashboardPage = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <span className="material-symbols-outlined text-[48px] text-gray-300 mb-4">history</span>
                <h2 className="text-xl font-bold text-text-main">Historial de Pedidos</h2>
                <p className="text-text-secondary mt-2">Próximamente podrás ver aquí todos tus pedidos.</p>
            </div>
        </div>
    );
};

export default DashboardPage;
