export interface InitialPortfolioData {
  profile: {
    name: string;
    title: string;
    description: string;
    email: string;
    location: string;
  };
  links: Array<{
    platform: string;
    url: string;
  }>;
  skills: Array<{
    name: string;
    category: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    period: string;
    startDate?: string;
    endDate?: string;
    achievements: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    url: string;
    repoUrl?: string;
    liveUrl?: string;
    technologies: string[];
  }>;
}

export const defaultPortfolioData: InitialPortfolioData = {
  profile: {
    name: 'Alisevich Stanislau',
    title: 'Full-Stack & Backend Engineer (Node.js, TypeScript, Python)',
    description:
      'Full-stack и Backend инженер с 4+ годами коммерческого опыта разработки. Специализируюсь на проектировании надежных серверных архитектур на Node.js / TypeScript (NestJS, Apollo GraphQL, Prisma) и Python. Практикую полный цикл разработки (end-to-end SDLC): от прямого взаимодействия с заказчиком, глубокого анализа бизнес-целей и проектирования системной архитектуры до реализации, тестирования, настройки Linux-серверов, контейнеризации в Docker, деплоя и долгосрочной технической поддержки.',
    email: 'alisevics558@gmail.com',
    location: 'Remote / Worldwide',
  },
  links: [
    {
      platform: 'GitHub',
      url: 'https://github.com/bracks1',
    },
    {
      platform: 'Email',
      url: 'mailto:alisevics558@gmail.com',
    },
  ],
  skills: [
    { name: 'End-to-End SDLC & Product Discovery', category: 'Engineering & Architecture' },
    { name: 'TypeScript', category: 'Programming Languages' },
    { name: 'JavaScript (ESNext / Node.js)', category: 'Programming Languages' },
    { name: 'Python', category: 'Programming Languages' },
    { name: 'NestJS', category: 'Backend Frameworks' },
    { name: 'GraphQL & Apollo Server (Sandbox, DataLoader)', category: 'API & Protocols' },
    { name: 'Prisma ORM', category: 'Databases & ORM' },
    { name: 'PostgreSQL, SQLite & MySQL', category: 'Databases & ORM' },
    { name: 'Docker & Docker Compose', category: 'DevOps & Infrastructure' },
    { name: 'Linux Server Administration', category: 'DevOps & Infrastructure' },
    { name: 'Telegram Bot API & Webhooks', category: 'Automation & Bots' },
    { name: 'Crypto & Multi-Wallet Trading Systems', category: 'FinTech & Web3' },
    { name: 'Vitest / Jest Automated Testing', category: 'Quality Assurance' },
    { name: 'Frontend Integration (React / Next.js / HTML5)', category: 'Full-Stack Development' },
  ],
  experience: [
    {
      company: 'Independent Software Engineering & Direct Client Consulting',
      position: 'Lead Full-Stack / Backend Engineer',
      period: '2022 — настоящее время',
      startDate: '2022-01',
      endDate: 'Present',
      achievements: [
        'Прямое ведение полного цикла разработки (Full SDLC): выявление бизнес-потребностей заказчиков, формирование технических требований, проектирование системной архитектуры и сдача проектов под ключ',
        'Разработка и успешный запуск отказоустойчивых веб-приложений (интернет-магазины, конверсионные лендинги, интерактивные сервисы) на Node.js, TypeScript и Python',
        'Проектирование и реализация специализированного программного комплекса для надежного управления большим количеством криптокошельков и автоматизации торговых процессов',
        'Создание высоконагруженных сервисов обмена и Telegram-ботов с интеграцией внешних платежных провайдеров и обработкой вебхуков в реальном времени',
        'Администрирование Linux-серверов, контейнеризация приложений в Docker, настройка CI/CD и обеспечение непрерывной доступности сервисов',
      ],
    },
    {
      company: 'Independent Consulting & Software Engineering',
      position: 'Python Full-Stack Developer',
      period: '2020 — 2022',
      startDate: '2020-01',
      endDate: '2022-01',
      achievements: [
        'Разработка кастомных веб-сервисов, парсеров и систем автоматизации на Python с реляционными и документными базами данных',
        'Создание клиентских интерфейсов и интеграция с внешними REST API в прямом контакте с конечными заказчиками',
        'Оптимизация серверной производительности, настройка защищенных окружений развертывания на Linux и долгосрочная поддержка проектов',
      ],
    },
  ],
  projects: [
    {
      name: 'Digital Business Card Backend API',
      description:
        'Цифровая визитка специалиста — модульный backend на NestJS, TypeScript, Prisma, GraphQL (Apollo Sandbox) и Docker с оптимизацией вложенных запросов через DataLoader и автоматическим заполнением базы данных.',
      url: 'https://github.com/bracks1/portfolio-backend',
      repoUrl: 'https://github.com/bracks1/portfolio-backend',
      technologies: ['NestJS', 'TypeScript', 'GraphQL', 'Prisma', 'Apollo Sandbox', 'Docker', 'Vitest'],
    },
    {
      name: 'Crypto Multi-Wallet Management & Trading Automation System',
      description:
        'Программный комплекс для безопасного централизованного управления большим пулом криптокошельков, мониторинга балансов и автоматизированного исполнения торговых операций (Private Client Project).',
      url: 'https://github.com/bracks1',
      repoUrl: 'https://github.com/bracks1',
      technologies: ['Node.js', 'TypeScript', 'Python', 'Web3', 'PostgreSQL', 'Docker', 'Linux'],
    },
    {
      name: 'Real-time Exchange Services & Telegram Bots Ecosystem',
      description:
        'Отказоустойчивая платформа для обработки обменных операций и сеть Telegram-ботов с поддержкой вебхуков, безопасными транзакциями и панелями управления (Private Client Project).',
      url: 'https://github.com/bracks1',
      repoUrl: 'https://github.com/bracks1',
      technologies: ['Node.js', 'NestJS', 'Python', 'Telegram API', 'Redis', 'Docker'],
    },
    {
      name: 'E-Commerce Platforms & Interactive Web Applications',
      description:
        'Высокопроизводительные интернет-магазины и веб-приложения с интеграцией платежных шлюзов, управлением заказами и личными кабинетами пользователей (Private Client Project).',
      url: 'https://github.com/bracks1',
      repoUrl: 'https://github.com/bracks1',
      technologies: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'Prisma', 'Nginx'],
    },
  ],
};
