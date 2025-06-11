import React, { useState, useEffect } from 'react';
import { 
  BarChart4, TrendingUp, Users, ShoppingCart, AlertTriangle,
  Sun, Moon, CreditCard, Clock, Coffee, ChevronRight,
  FileText, ShoppingBag, PieChart, Plus, ArrowRight
} from 'lucide-react';
import { useRestaurante } from '../contexts/RestauranteContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatarDinheiro } from '../utils/formatters';
import Button from '../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DatabaseService } from '../services/database';

const Dashboard: React.FC = () => {
  const { mesas, produtos, comandas, loading } = useRestaurante();
  const { displayName } = useAuth();
  const { theme } = useTheme();
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setStatsLoading(true);
      // For now, we'll calculate stats from the loaded data
      // Later we can use the dashboard_stats view
      const stats = {
        vendas_hoje: 3241.40,
        vendas_mes: 45890.75,
        total_mesas: mesas?.length || 0,
        mesas_ocupadas: mesas?.filter(m => m.status === 'ocupada').length || 0,
        mesas_livres: mesas?.filter(m => m.status === 'livre').length || 0,
        total_produtos: produtos?.length || 0,
        comandas_abertas: comandas?.filter(c => c.status === 'aberta').length || 0
      };
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Safe data access with fallbacks
  const mesasOcupadas = mesas?.filter(mesa => mesa.status === 'ocupada') || [];
  const mesasAguardandoPagamento = mesas?.filter(mesa => mesa.status === 'aguardando') || [];
  const comandasAbertas = comandas?.filter(c => c.status === 'aberta') || [];
  
  // Métricas calculadas
  const vendasHoje = dashboardStats?.vendas_hoje || 0;
  const vendasMes = dashboardStats?.vendas_mes || 0;
  const tempoMedioAtendimento = 28; // minutos
  const clientesAtivos = mesasOcupadas.length * 2; // Estimativa
  const comandasFechadas = 125;

  // Dados para gráficos
  const vendasPorHora = [
    { hora: '08:00', vendas: 450 },
    { hora: '10:00', vendas: 890 },
    { hora: '12:00', vendas: 1250 },
    { hora: '14:00', vendas: 980 },
    { hora: '16:00', vendas: 760 },
    { hora: '18:00', vendas: 1100 },
    { hora: '20:00', vendas: 1450 }
  ];

  const produtosMaisVendidos = [
    { nome: 'Picanha', quantidade: 45 },
    { nome: 'Cerveja', quantidade: 120 },
    { nome: 'Frango Parmegiana', quantidade: 38 },
    { nome: 'Refrigerante', quantidade: 85 }
  ];

  const alertasEstoque = [
    { id: 1, produto: 'Picanha', quantidade: 5 },
    { id: 2, produto: 'Arroz', quantidade: 15 },
    { id: 3, produto: 'Coca-Cola', quantidade: 24 }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (loading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com saudação */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              {theme === 'dark' ? (
                <Moon className="text-blue-100" size={24} />
              ) : (
                <Sun className="text-yellow-200" size={24} />
              )}
              <h1 className="text-2xl font-bold">
                {getGreeting()}, {displayName || 'Usuário'}!
              </h1>
            </div>
            <p className="mt-1 text-blue-100">
              Aqui está o resumo do seu restaurante
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-blue-100">{new Date().toLocaleDateString()}</p>
              <p className="text-lg font-semibold">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vendas Hoje</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatarDinheiro(vendasHoje)}
              </p>
              <p className="text-sm text-green-500 mt-1">+12% vs ontem</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <TrendingUp size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vendas do Mês</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatarDinheiro(vendasMes)}
              </p>
              <p className="text-sm text-green-500 mt-1">+8% vs mês anterior</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
              <BarChart4 size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tempo Médio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {tempoMedioAtendimento} min
              </p>
              <p className="text-sm text-green-500 mt-1">-5% vs média</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
              <Clock size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {clientesAtivos}
              </p>
              <p className="text-sm text-green-500 mt-1">+15% vs média</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-full">
              <Users size={24} className="text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Vendas por Hora */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Vendas por Hora
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendasPorHora}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendas" name="Vendas (R$)" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Produtos Mais Vendidos
          </h2>
          <div className="space-y-4">
            {produtosMaisVendidos.map((produto, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {produto.nome}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      ({produto.quantidade} un)
                    </span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(produto.quantidade / 120) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status das Comandas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Status das Comandas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Abertas</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {comandasAbertas.length}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Fechadas</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {comandasFechadas}
              </p>
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Alertas do Sistema
          </h2>
          <div className="space-y-4">
            {alertasEstoque.map((alerta) => (
              <div
                key={alerta.id}
                className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="text-red-500 dark:text-red-400" size={20} />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Estoque Baixo: {alerta.produto}
                    </h3>
                    <p className="text-xs text-red-600 dark:text-red-300">
                      Quantidade atual: {alerta.quantidade} unidades
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;