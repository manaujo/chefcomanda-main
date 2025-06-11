import React from "react";
import { Link } from "react-router-dom";
import {
  ChefHat,
  ArrowRight,
  Check,
  Star,
  Users,
  BarChart3,
  Coffee,
  ShoppingCart,
  CreditCard,
  Clock,
  Shield,
  Smartphone,
  Printer,
  TrendingUp,
  Award,
  Zap,
  MessageCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import Img from "../assets/relatorios.jpeg";
import Img1 from "../assets/cmv.jpeg";
import Img2 from "../assets/dashboard.jpeg";
import Button from "../components/ui/Button";

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Gestão de Mesas",
      description:
        "Controle completo das mesas do seu restaurante com status em tempo real e atribuição de garçons."
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Comandas Digitais",
      description:
        "Sistema de comandas digitais com acompanhamento de pedidos da cozinha até a entrega."
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "PDV Completo",
      description:
        "Ponto de venda integrado com múltiplas formas de pagamento (PIX, cartão, dinheiro)."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Relatórios Avançados",
      description:
        "Análises detalhadas de vendas, produtos mais vendidos e desempenho dos garçons."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Gestão de Funcionários",
      description:
        "Controle de acesso por perfis (admin, garçom, cozinha, caixa) com logs de auditoria."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Cardápio Online",
      description:
        "QR Code para cardápio digital que os clientes podem acessar pelo celular."
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "R$ 40,00",
      description: "Sistema de Ponto de venda e estoque",
      features: [
        "Sistema de PDV completo",
        "Controle de estoque",
        "Dashboard e relatórios",
        "Exportação de dados (PDF e Excel)",
        "Relatórios avançados de vendas",
        "Suporte padrão",
        "Teste grátis de 7 dias"
      ],
      popular: false
    },
    {
      name: "Básico",
      price: "R$ 60,90",
      description: "Ideal para começar",
      features: [
        "Acesso completo às comandas e mesas",
        "Gerenciamento para garçons e cozinha",
        "Controle de estoque",
        "Acesso ao dashboard",
        "Relatórios avançados de vendas",
        "Exportação de dados (PDF e Excel)",
        "Suporte padrão",
        "Teste grátis de 7 dias"
      ],
      popular: false
    },
    {
      name: "Profissional",
      price: "R$ 85,90",
      description: "Mais completo",
      features: [
        "Todas as funcionalidades do plano Básico",
        "Sistema de PDV completo",
        "Integração com iFood",
        "Controle de estoque avançado",
        "Relatórios detalhados",
        "Exportação de dados (PDF e Excel)",
        "Relatórios avançados de vendas",
        "Suporte prioritário",
        "Teste grátis de 7 dias"
      ],
      popular: true
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Proprietário - Restaurante Sabor & Arte",
      content:
        "O ChefComanda revolucionou nosso atendimento. Reduzimos o tempo de espera em 40% e aumentamos nossa receita em 25%.",
      rating: 5
    },
    {
      name: "Ana Santos",
      role: "Gerente - Pizzaria Bella Vista",
      content:
        "Sistema muito intuitivo e completo. Os relatórios nos ajudam a tomar decisões estratégicas baseadas em dados reais.",
      rating: 5
    },
    {
      name: "Pedro Oliveira",
      role: "Chef - Bistrô Gourmet",
      content:
        "A integração entre cozinha e salão ficou perfeita. Nossos garçons e cozinheiros adoraram a facilidade do sistema.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                ChefComanda
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="#funcionalidades"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Funcionalidades
              </a>
              <a
                href="#precos"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Preços
              </a>
              <a
                href="#depoimentos"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Depoimentos
              </a>
              <a
                href="#contato"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contato
              </a>
            </nav>
            <Link to="/login">
              <Button
                variant="primary"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Transforme seu restaurante com o
                <span className="text-blue-600"> ChefComanda</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Sistema completo de gestão para restaurantes. Controle mesas,
                comandas, estoque, vendas e muito mais em uma única plataforma
                moderna e intuitiva.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    icon={<ArrowRight size={20} />}
                  >
                    Começar Teste Grátis
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    document
                      .getElementById("funcionalidades")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Ver Demonstração
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  Teste grátis de 7 dias
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  Sem taxa de instalação
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  Suporte especializado
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                <img
                  src={Img2}
                  alt="Dashboard do ChefComanda"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Dashboard Intuitivo
                  </h3>
                  <p className="text-gray-600">
                    Visualize todas as métricas importantes do seu restaurante
                    em tempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600 mt-2">Restaurantes Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1M+</div>
              <div className="text-gray-600 mt-2">Pedidos Processados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">40%</div>
              <div className="text-gray-600 mt-2">
                Redução no Tempo de Atendimento
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">25%</div>
              <div className="text-gray-600 mt-2">Aumento Médio na Receita</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Completas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tudo que você precisa para gerenciar seu restaurante de forma
              eficiente e moderna
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Screenshots Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={Img1}
                alt="Gestão de Mesas"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  CMV em Tempo Real
                </h3>
                <p className="text-gray-600">
                  Análise e controle dos custos dos produtos vendidos
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={Img}
                alt="Relatórios Avançados"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Relatórios Detalhados
                </h3>
                <p className="text-gray-600">
                  Análises completas de vendas, produtos mais vendidos e
                  performance da equipe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Por que escolher o ChefComanda?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-600 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Aumento da Eficiência
                    </h3>
                    <p className="text-gray-600">
                      Reduza o tempo de atendimento e elimine erros com nosso
                      sistema automatizado.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-600 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Aumento da Receita
                    </h3>
                    <p className="text-gray-600">
                      Otimize suas operações e aumente suas vendas com dados
                      precisos e insights valiosos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Segurança Total
                    </h3>
                    <p className="text-gray-600">
                      Seus dados estão protegidos com criptografia de ponta e
                      backups automáticos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Suporte 24/7
                    </h3>
                    <p className="text-gray-600">
                      Nossa equipe está sempre disponível para ajudar você a ter
                      sucesso.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
                alt="Equipe usando ChefComanda"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planos que Cabem no seu Orçamento
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para o seu restaurante
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  plan.popular ? "ring-2 ring-blue-500 transform scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                    Mais Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link to="/signup">
                      <Button
                        variant={plan.popular ? "primary" : "secondary"}
                        fullWidth
                        className={
                          plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""
                        }
                      >
                        Começar Teste Grátis
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Histórias reais de sucesso com o ChefComanda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para transformar seu restaurante?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de restaurantes que já aumentaram suas vendas
            com o ChefComanda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                variant="secondary"
                size="lg"
                className=" text-blue-600 bg-gray-100 w-full sm:w-auto"
                icon={<ArrowRight size={20} />}
              >
                Começar Teste Grátis de 7 Dias
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              className="text-white border-white hover:bg-blue-700 w-full sm:w-auto"
            >
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <ChefHat className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">ChefComanda</span>
              </div>
              <p className="text-gray-400">
                Transformando restaurantes com tecnologia moderna e intuitiva.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#funcionalidades"
                    className="hover:text-white transition-colors"
                  >
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a
                    href="#precos"
                    className="hover:text-white transition-colors"
                  >
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrações
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentação
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Treinamentos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status do Sistema
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>(62) 9999-9999</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>chefcomandaoficial@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>Goiania, Go</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ChefComanda. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
