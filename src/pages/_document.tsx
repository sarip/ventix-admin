import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en" className="light-style layout-navbar-fixed layout-menu-fixed layout-compact" dir="ltr" data-theme="theme-default" data-assets-path="/assets/" data-template="vertical-menu-template-starter">
            <Head>
                {/* Inline script: baca theme dari localStorage sebelum render untuk menghindari flash */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
(function() {
  try {
    var savedTheme = localStorage.getItem('theme');
    // Jika belum pernah set (pertama kali buka), default ke light
    if (!savedTheme) {
      savedTheme = 'light';
      localStorage.setItem('theme', 'light');
    }
    var html = document.documentElement;
    html.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      html.classList.remove('light-style');
      html.classList.add('dark-style');
    } else {
      html.classList.remove('dark-style');
      html.classList.add('light-style');
    }
  } catch(e) {}
})();
                        `
                    }}
                />
                <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
                <link rel="icon" type="image/x-icon" href="/assets/img/favicon/favicon.ico"/>

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
                <link
                    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Rubik:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"/>

                <link rel="stylesheet" href="/assets/vendor/fonts/boxicons.css"/>
                <link rel="stylesheet" href="/assets/vendor/fonts/fontawesome.css"/>
                <link rel="stylesheet" href="/assets/vendor/fonts/flag-icons.css"/>

                {/* Core CSS */}
                <link rel="stylesheet" href="/assets/vendor/css/rtl/core.css" className="template-customizer-core-css"/>
                <link rel="stylesheet" href="/assets/vendor/css/rtl/theme-default.css"
                      className="template-customizer-theme-css"/>
                <link rel="stylesheet" href="/assets/css/demo.css"/>

                {/* Vendors CSS */}
                <link rel="stylesheet" href="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css"/>
                <link rel="stylesheet" href="/assets/vendor/libs/spinkit/spinkit.css"/>
                <link rel="stylesheet" href="/assets/vendor/libs/toastr/toastr.css"/>
                <link rel="stylesheet" href="/assets/vendor/libs/select2/select2.css"/>


                {/* Boxicons */}
                {/*<link rel="stylesheet" href="/assets/vendor/fonts/boxicons.css"/>*/}
                <script src="/assets/vendor/libs/jquery/jquery.js"></script>
                <script src="/assets/vendor/libs/block-ui/block-ui.js"></script>
                <script src="/assets/vendor/js/helpers.js"></script>
                <script src="/assets/vendor/js/template-customizer.js"></script>
                <script src="/assets/vendor/libs/toastr/toastr.js"></script>
                <script src="/assets/vendor/libs/select2/select2.js"></script>
                <script src="/assets/js/config.js"></script>
            </Head>


            <body>
            <Main/>
            <NextScript/>

            {/* Core JS */}

            <script src="/assets/vendor/libs/popper/popper.js"></script>
            <script src="/assets/vendor/js/bootstrap.js"></script>
            <script src="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
            <script src="/assets/vendor/libs/hammer/hammer.js"></script>
            <script src="/assets/vendor/libs/i18n/i18n.js"></script>
            <script src="/assets/vendor/libs/typeahead-js/typeahead.js"></script>
            <script src="/assets/vendor/js/menu.js"></script>


            {/* Template customizer & Theme config files */}


            {/* Main JS */}
            <script src="/assets/js/main.js" ></script>
            </body>
        </Html>
    );
}
