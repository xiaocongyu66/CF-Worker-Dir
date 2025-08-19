/** * 自定义网站配置 */
const config = {
  title: "自定义导航",
  subtitle: "Cloudflare Workers Dir",
  logo_icon: "sitemap",
  hitokoto: true,
  search: true,
  search_engine: [
    { name: "百 度", template: "https://www.baidu.com/s?wd=$s" },
    { name: "谷 歌", template: "https://www.google.com/search?q=$s" },
    { name: "必 应", template: "https://www.bing.com/search?q=$s" },
    { name: "搜 狗", template: "https://www.sogou.com/web?query=$s" },
  ],
  selling_ads: true,
  sell_info: {
    domain: "example.com",
    price: 500,
    mon_unit: "yen sign",
    contact: [
      { type: "envelope", content: "info@example.com" }
    ]
  },
  lists: [
    {
      name: "技术",
      icon: "code",
      list: [
        { url: "https://oschina.net/", name: "开源中国", desc: "程序员集散地" },
        { url: "https://v2ex.com", name: "V2EX", desc: "程序员集散地" },
        { url: "https://csdn.net/", name: "CSDN技术社区", desc: "程序员集散地" },
        { url: "https://github.com/", name: "Github", desc: "程序员集散地" },
      ]
    },
    {
      name: "学习",
      icon: "graduation cap",
      list: [
        { url: "https://w3school.com.cn/", name: "W3school在线教程", desc: "程序员集散地" },
        { url: "https://runoob.com/", name: "菜鸟教程", desc: "程序员集散地" },
        { url: "https://segmentfault.com/", name: "思否社区", desc: "程序员集散地" },
        { url: "https://jianshu.com/", name: "简书", desc: "程序员集散地" },
      ]
    },
    {
      name: "娱乐congyu",
      icon: "graduation cap",
      list: [
        { name: "jsDelivr CDN", url: "https://cdnjsd.congyu.dpdns.org/", desc: "jsDelivr开源实例" },
        { name: "Splayer", url: "https://player.congyu.dpdns.org/", desc: "网页音乐播放" },
        { name: "twikoo", url: "https://twikoo.congyu.dpdns.org/", desc: "twikoo评论实例" },
        { name: "waline", url: "https://waline.congyu.dpdns.org/", desc: "waline评论实例" },
        { name: "LibreTV", url: "https://tv.congyu.dpdns.org/", desc: "娱乐观影" },
        { name: "moepush", url: "https://moepush.congyu.dpdns.org/", desc: "moepush推送实例" },
        { name: "moemail", url: "https://moemail.congyu.dpdns.org/", desc: "moemail邮箱实例" },
      ]
    },
  ]
};

/** 工具函数 - 创建HTML元素 */
const el = (tag, attrs = {}, content = "") => {
  const attributes = Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  return `<${tag} ${attributes}>${content}</${tag}>`;
};

/** 获取网站favicon (带缓存) */
const faviconCache = {};
function getFavicon(url) {
  if (faviconCache[url]) return faviconCache[url];
  
  try {
    const domain = url.startsWith('http') ? 
      new URL(url).hostname : 
      new URL(`http://${url}`).hostname;
    
    const faviconUrl = `https://www.google.cn/s2/favicons?sz=64&domain=${domain}`;
    faviconCache[url] = faviconUrl;
    return faviconUrl;
  } catch (e) {
    return "https://www.google.cn/favicon.ico";
  }
}

/** 渲染函数 */
const renderFunctions = {
  /** 渲染头部 */
  header: () => {
    const { hitokoto, search, selling_ads, search_engine, logo_icon, title, subtitle } = config;
    
    const nav = hitokoto ? 
      el('div', { class: "ui container" }, 
        el('div', { class: "ui large secondary inverted menu" }, 
          el('div', { class: "item" }, 
            el('p', { id: "hitokoto" }, '条条大路通罗马')
          )
        )
      ) : "";
    
    const searchInput = search ? `
      <form id="search-form" class="ui left corner labeled right icon fluid large input">
        <div class="ui left corner label">
          <img id="search-fav" class="left floated avatar ui image" src="https://www.baidu.com/favicon.ico">
        </div>
        <input id="searchinput" type="search" placeholder="搜索你想要知道的……" autocomplete="off">
        <button type="submit" class="ui icon button">
          <i class="inverted circular search link icon"></i>
        </button>
      </form>
      <div id="sengine" class="ui bottom attached tabular inverted secondary menu">
        <div class="header item">&nbsp;</div>
        ${search_engine.map((link, i) => 
          el('a', { 
            class: `item ${i === 0 ? 'active' : ''}`, 
            'data-url': link.template,
            'data-domain': new URL(link.template.split('$s')[0]).hostname
          }, link.name)
        ).join("")}
      </div>
    ` : "";
    
    const sellButton = selling_ads ? 
      '<div><a id="menubtn" class="red ui icon inverted button"><i class="heart icon"></i> 喜欢此域名 </a></div>' : '';
    
    return el('header', {}, `
      <div id="head" class="ui inverted vertical masthead center aligned segment">
        ${nav}
        <div id="title" class="ui text container">
          <h1 class="ui inverted header">
            <i class="${logo_icon} icon"></i>
            <div class="content">
              ${title}
              <div class="sub header">${subtitle}</div>
            </div>
          </h1>
          ${searchInput}
          ${sellButton}
        </div>
      </div>
    `);
  },

  /** 渲染主体内容 */
  main: () => {
    return el('main', {}, `
      <div class="ui container">
        ${config.lists.map(section => `
          <div class="ui basic segment">
            <h4 class="ui horizontal divider header">
              <i class="${section.icon} icon"></i>
              ${section.name}
            </h4>
            <div class="ui four stackable cards">
              ${section.list.map(item => `
                <a class="card" href="${item.url}" target="_blank">
                  <div class="content">
                    <img class="left floated avatar ui image" 
                         src="${getFavicon(item.url)}" 
                         alt="${item.name} icon">
                    <div class="header">${item.name}</div>
                    <div class="meta">${item.desc}</div>
                  </div>
                </a>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `);
  },

  /** 渲染页脚 */
  footer: () => {
    return el('footer', {}, `
      <div class="footer">
        Powered by 
        <a class="ui label" href="https://github.com/sleepwood/cf-worker-dir" target="_blank">
          <i class="github icon"></i> Cf-Worker-Dir
        </a>
        &copy; Base on 
        <a class="ui label">
          <i class="balance scale icon"></i> MIT License
        </a>
      </div>
    `);
  },

  /** 渲染销售信息 */
  seller: () => {
    if (!config.selling_ads) return '';
    
    const { domain, price, mon_unit, contact } = config.sell_info;
    
    return `
      <div id="seller" class="ui basic modal">
        <h1 class="ui yellow dividing header">
          <i class="gem outline icon"></i>
          <div class="content">
            ${domain} 正在出售
          </div>
        </h1>
        <div class="content">
          <div class="ui basic segment">
            <div class="ui two column stackable center aligned grid">
              <div class="ui inverted vertical divider">感兴趣？</div>
              <div class="middle aligned row">
                <div class="column">
                  <div class="ui large yellow statistic">
                    <div class="value">
                      <i class="${mon_unit} icon"></i> ${price}
                    </div>
                  </div>
                </div>
                <div class="column">
                  <h3 class="ui center aligned icon inverted header">
                    <i class="circular envelope open outline grey inverted icon"></i>
                    联系我
                  </h3>
                  <div class="ui relaxed celled large list">
                    ${contact.map(item => `
                      <div class="item">
                        <i class="${item.type} icon"></i>
                        <div class="content">${item.content}</div>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="ui basic cancel inverted button">
            <i class="reply icon"></i> 返回
          </div>
        </div>
      </div>
    `;
  },

  /** 渲染完整页面 */
  fullPage: () => {
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>${config.title} - ${config.subtitle}</title>
        <link href="https://cdn.jsdelivr.net/npm/semantic-ui-css@2.4.1/semantic.min.css" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/gh/sleepwood/cf-worker-dir@0.1.1/style.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/semantic-ui-css@2.4.1/semantic.min.js"></script>
      </head>
      <body>
        ${renderFunctions.header()}
        ${renderFunctions.main()}
        ${renderFunctions.footer()}
        ${renderFunctions.seller()}
        
        <script src="https://v1.hitokoto.cn/?encode=js&select=%23hitokoto" defer></script>
        <script>
          // 初始化函数
          function initApp() {
            // 搜索功能
            $('#sengine').on('click', 'a.item', function() {
              $('#sengine a.active').removeClass('active');
              $(this).addClass('active');
              $('#search-fav').attr('src', 'https://www.google.me/s2/favicons?sz=64&domain=' + $(this).data('domain'));
            });
            
            // 表单提交处理
            $('#search-form').on('submit', function(e) {
              e.preventDefault();
              const template = $('#sengine a.active').data('url');
              const query = $('#searchinput').val().trim();
              
              if (query) {
                const encodedQuery = encodeURIComponent(query);
                window.open(template.replace('$s', encodedQuery));
              }
            });
            
            // 搜索框回车事件
            $("#searchinput").on("keypress", function(e) {
              if (e.key === "Enter") {
                $('#search-form').trigger('submit');
              }
            });
            
            // 域名销售弹窗
            $('#menubtn').on('click', function() {
              $('#seller').modal('show');
            });
            
            // 初始化第一个搜索引擎的favicon
            const firstEngine = $('#sengine a.item:first');
            if (firstEngine.length) {
              $('#search-fav').attr('src', 
                'https://www.google.me/s2/favicons?sz=64&domain=' + firstEngine.data('domain'));
            }
          }
          
          // 文档加载完成后初始化
          $(document).ready(initApp);
        </script>
      </body>
      </html>
    `;
  }
};

/** 请求处理 */
async function handleRequest(request) {
  try {
    return new Response(renderFunctions.fullPage(), {
      headers: { 'content-type': 'text/html;charset=UTF-8' }
    });
  } catch (error) {
    return new Response(`服务器错误: ${error.message}`, { 
      status: 500,
      headers: { 'content-type': 'text/plain' }
    });
  }
}

// 监听fetch事件
addEventListener('fetch'， event => {
  event.respondWith(handleRequest(event.request));
});
