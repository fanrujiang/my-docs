import {navbar} from "vuepress-theme-hope";

export default navbar([
    // "/",
    {
        text: "博客",
        icon: "/assets/icon/blog.svg",
        link: "/blog/"
    },


    {
        text: "索引",
        icon: "/img/suoyin.svg",
        children: [
            {
                text: "所有文章",
                icon: "/img/any.svg",
                link: "/article/"
            },
            {
                text: "分类",
                icon: "/img/suoyin.svg",
                link: "/category/"
            },
            {
                text: "标签",
                icon: "tag",
                link: "/tag/"
            },
            {
                text: "时间轴",
                icon: "/img/time.svg",
                link: "/timeline/"
            },

        ]
    },

    {
        text: "知识库",
        icon: "/img/book.svg",
        children: [
            {
                text: "AJAX",
                icon: "ajax",
                link: "/ajax/"
            },

            {
                text: "JavaSE",
                icon: "java",
                link: "/javaSE/"
            },

            {
                text: "Linux",
                icon: "/img/linux.svg",
                link: "/linux/"
            },

            {
                text: "Docker",
                icon: "/img/docker.svg",
                link: "/docker/"
            },

            {
                text: "Nginx",
                icon: "nginx",
                link: "/nginx/"
            },

            {
                text: "nodeJS",
                icon: "/img/node.svg",
                link: "/nodeJS/"
            },

            {
                text: "ES",
                icon: "/img/es.svg",
                link: "/Elasticsearch/"
            },

            {
                text: "RabbitMQ",
                icon: "/img/rabbitmq.svg",
                link: "/mq/rabbitMQ/"
            },
            {
                text: "Spring",
                icon: "/img/spring.svg",
                link: "/spring/"
            },
        ]
    },

    {
        text: "生活",
        icon: "/img/holiday.svg",
        children: [
            {
                text: "杂记",
                icon: "/img/book.svg",
                link: "/other/life/",
            },

            {
                text: "游戏",
                icon: "/img/game.svg",
                link: "/other/game/",
            },

            {
                text: "足迹",
                icon: "/img/lvXing.svg",
                link: "/other/world/",
            }
        ]
    },

    {
        text: "关于",
        icon: "/assets/icon/about-me.svg",
        link: "/about/",
    },

]);
