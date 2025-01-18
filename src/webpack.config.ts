import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'node:path'
import { DefinePlugin, ProgressPlugin, HotModuleReplacementPlugin } from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

import type { Configuration as WebpackConfigurations } from 'webpack'
import type { Configuration as WebpackDevServerConfigurations } from 'webpack-dev-server'

export type TConfiguration = {
    devServer?: WebpackDevServerConfigurations
} & WebpackConfigurations

export type TEnv = {
    NODE_ENV?: 'production' | 'development'
    PUBLIC_PATH?: string
    BASE_URL?: string
    PORT?: number
}

export default ({
    NODE_ENV = 'development',
    PUBLIC_PATH = 'auto',
    BASE_URL = '/',
    PORT = 3000,
}: TEnv): TConfiguration => {
    const src = path.resolve(process.cwd(), 'src')
    const dist = path.resolve(process.cwd(), 'dist')
    const isDev = NODE_ENV === 'development'

    return {
        // Режим сборки: 'development' или 'production', задаётся через NODE_ENV
        mode: NODE_ENV,
        // Тип source maps для отладки: 'eval-source-map' для разработки, 'nosources-source-map' для продакшена
        devtool: isDev ? 'eval-source-map' : 'nosources-source-map',
        // Входная точка приложения
        entry: path.resolve(src, 'index.tsx'),
        // Настройки выходного файла
        output: {
            // Папка для сборки
            path: dist,
            // Публичный путь для загрузки ресурсов
            publicPath: PUBLIC_PATH,
            // Имя выходного файла с добавлением хэша для кэширования
            filename: '[name].[contenthash:8].js',
            // Очистка директории перед сборкой
            clean: true,
        },
        // Настройки разрешения модулей
        resolve: {
            // Расширения файлов, которые можно импортировать без указания расширения
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            // Предпочитать абсолютные пути для модулей
            preferAbsolute: true,
            // Где искать модули: исходный код и node_modules
            modules: [src, 'node_modules'],
            // Главные файлы для модуля
            mainFiles: ['index'],
            // Псевдонимы для сокращения путей
            alias: {
                react: path.resolve('./node_modules/react'),
            },
        },
        // Настройки загрузчиков для обработки различных типов файлов
        module: {
            rules: [
                {
                    // Обработка TypeScript и TSX файлов
                    test: /\.(ts|tsx)$/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            // Только транспиляция без проверки типов в разработке
                            transpileOnly: isDev,
                        },
                    },
                    exclude: /node_modules/, // Исключить node_modules
                },
                {
                    // Обработка SVG файлов через svgr
                    test: /\.svg$/,
                    use: '@svgr/webpack',
                },
                {
                    // Загрузка изображений и шрифтов через file-loader
                    test: /\.(png|jpe?g|gif|woff|woff2)$/i,
                    use: 'file-loader',
                },
                {
                    // Обработка CSS файлов
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        // Настройки плагинов
        plugins: [
            // Генерация HTML файла с подключением выходных файлов
            new HtmlWebpackPlugin({
                template: path.resolve(process.cwd(), 'public', 'index.html'),
            }),
            // Определение глобальных переменных окружения для использования в коде
            new DefinePlugin({
                IS_DEV: JSON.stringify(isDev),
                BASE_URL: JSON.stringify(BASE_URL),
            }),
            // Прогресс-бар во время сборки
            new ProgressPlugin(),
            // Поддержка Hot Module Replacement для обновления модулей без перезагрузки страницы
            new HotModuleReplacementPlugin(),
            new ForkTsCheckerWebpackPlugin({
                // Проверка типов асинхронно в режиме разработки
                async: isDev,
                typescript: {
                    diagnosticOptions: {
                        // Проверка семантики TypeScript
                        semantic: true,
                        // Проверка синтаксиса
                        syntactic: true,
                    },
                },
            }),
        ],
        // Настройки DevServer для разработки
        devServer: {
            // Порт разработки
            port: PORT,
            // Для SPA: перенаправление всех запросов на index.html
            historyApiFallback: true,
            // Путь к статическим файлам
            static: path.resolve(process.cwd(), 'dist'),
            // Открытие браузера при старте DevServer
            open: true,
        },
    }
}
