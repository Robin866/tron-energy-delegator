// 等待DOM完全加载后再执行
document.addEventListener("DOMContentLoaded", () => {
    const languageContent = {
        en: {
            energyexchange: "Energy exchange",
            platformintro: "About",
            faq: "FAQ",
            onlinesupport: "Support",
            welcomeinfo: "Welcome to the TRON TRC20 network transfer cost-saving assistant",
            slogon: "Simple, convenient, and reliable",
            heroprocess: "5 TRX per transaction — Transfer to the platform wallet — Wait for 10 seconds — Proceed with USDT transfer as usual — Save on fees",
            walletinfo: "Platform billing address",
            copysuccess: "Copied!",
        },
        cn: {
            energyexchange: "能量兑换",
            platformintro: "关于我们",
            faq: "常见问题",
            onlinesupport: "在线支持",
            welcomeinfo: "欢迎使用波场Trc20网络转账省钱助手",
            slogon: "简单方便，值得信赖",
            heroprocess: "5TRX/笔——转账至平台钱包——等待10秒——正常进行USDT转账——节省手续费",
            walletinfo: "平台收款地址",
            copysuccess: "复制成功",
            
        },
    };

    // 切换语言函数
    
     function switchLanguage(lang) {
        // 处理带有 data-lang 的内容
        document.querySelectorAll("[data-lang]").forEach((el) => {
            const key = el.getAttribute("data-lang");
            if (languageContent[lang][key]) {
                el.textContent = languageContent[lang][key];
            } else {
                console.warn(`Missing translation for key: ${key}`);
            }
        });

        // 处理带有 data-lang-cn 和 data-lang-en 的内容
        document.querySelectorAll("[data-lang-cn], [data-lang-en]").forEach((el) => {
            if (lang === "cn") {
                el.innerHTML = el.getAttribute("data-lang-cn");
            } else if (lang === "en") {
                el.innerHTML = el.getAttribute("data-lang-en");
            }
        });
    }


    // 绑定语言切换事件
    document.getElementById("en-btn").addEventListener("click", () => switchLanguage("en"));
    document.getElementById("cn-btn").addEventListener("click", () => switchLanguage("cn"));

    // 初始化语言
    switchLanguage("cn");

    // 点击缩略图显示完整二维码
    const qrThumbnail = document.getElementById("qr-thumbnail");
    const qrPopup = document.getElementById("qr-popup");

    qrThumbnail.addEventListener("click", () => {
        if (qrPopup) {
            qrPopup.classList.remove("hidden"); // 移除隐藏类显示大图
            console.log("Popup displayed");
        } else {
            console.error("Error: QR popup element not found!");
        }
    });

    // 点击大图关闭弹出框
    qrPopup.addEventListener("click", () => {
        if (qrPopup) {
            qrPopup.classList.add("hidden"); // 添加隐藏类隐藏大图
            console.log("Popup hidden");
        }
    });

    // 点击复制按钮复制钱包地址
    const copyButton = document.getElementById("copy-button");
   // const walletAddress = document.getElementById("wallet-address").innerText;
    const walletAddressElement = document.getElementById("wallet-address");
    let walletAddress = walletAddressElement.innerText.trim(); // 去掉首尾的空格和换行符
    const copySuccess = document.getElementById("copy-success");

    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(walletAddress).then(() => {
            copySuccess.classList.remove("hidden");
            setTimeout(() => {
                copySuccess.classList.add("hidden");
            }, 1000); // 1秒后隐藏复制成功提示
        });
    });

    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.querySelector("nav");

    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
});