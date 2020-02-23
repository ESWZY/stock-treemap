package com.first.stock_treemap;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    WebView mWebview;
    WebSettings mWebSettings;
    TextView beginLoading,endLoading,loading,mtitle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        findViewById(R.id.top);
        mWebview = findViewById(R.id.webView1);
        mtitle = findViewById(R.id.title);

        //支持javascript
        mWebview.getSettings().setJavaScriptEnabled(true);
        // 设置可以支持缩放
        mWebview.getSettings().setSupportZoom(true);
        // 设置出现缩放工具
        mWebview.getSettings().setBuiltInZoomControls(true);
        //设置滚动条
        mWebview.setVerticalScrollBarEnabled(true);
        mWebview.setHorizontalScrollBarEnabled(true);
        mWebview.setScrollbarFadingEnabled(false);
        //扩大比例的缩放
        mWebview.getSettings().setUseWideViewPort(true);
        //自适应屏幕
        mWebview.getSettings().setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);
        mWebview.getSettings().setLoadWithOverviewMode(true);

        //打开html
        mWebview.loadUrl("file:///android_asset/www/Stock Treemap.html");
        //mWebview.loadUrl("http://www.z3quant.com/dbus/map.shtml");
        //mWebview.loadUrl("http://www.baidu.com/");

        //设置不用系统浏览器打开,直接显示在当前Webview
        mWebview.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
    }


    //销毁Webview
    @Override
    protected void onDestroy() {
        if (mWebview != null) {
            mWebview.loadDataWithBaseURL(null, "", "text/html", "utf-8", null);
            mWebview.clearHistory();

            ((ViewGroup) mWebview.getParent()).removeView(mWebview);
            mWebview.destroy();
            mWebview = null;
        }
        super.onDestroy();
    }
}
