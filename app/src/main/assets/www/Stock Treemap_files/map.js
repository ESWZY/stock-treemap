var zntyMapPerf = {};
var tmpCode = "";
var zntyMapAdditional = {};
var url = "http://www.z3quant.com/openapi/openjson/tx/.json?";
$("#hqTimeTxt").text("             ");
var restoreParents = function(data, parent) {
    if (parent) {
        data.parent = parent;
    }
    (data.children || []).forEach(function(d) {
        restoreParents(d, data);
    });
};

function zntyRestorePerf(data) {
    if (typeof zntyMapPerf[data.name] !== 'undefined') {
        data.perf = zntyMapPerf[data.name];
    }
    if (typeof zntyMapAdditional[data.name] !== 'undefined') {
        data.additional = zntyMapAdditional[data.name];
    }
    (data.children || []).forEach(function(d) {
        zntyRestorePerf(d);
    });
}

function zntyInitMap(width, mapData, color) {
    restoreParents(mapData);
    zntyRestorePerf(mapData);
    zntyInitCanvas(mapData, "sec", "", width, color, "", "", true);
}
var h = 900;
var type = "mkt_idx.cur_chng_pct";
var selectedColor = '';
$('#body').height(h);
var w = $('#body').width();
var legend_w = $('.map_scale').outerWidth(true);
$('.zn_tip').width(w - legend_w - 10);
var treemap = d3.layout.treemap()
    .sort(function(d1, d2) {
        return d1.scale - d2.scale;
    })
    .size([w, h])
    .value(function(d) {
        return d.scale;
    })
    .padding(function(d) {
        if (d.depth === 1) {
            return [17, 1, 1, 1];
        } else if (d.depth === 2) {
            return [12, 1, 2, 1];
        }
        return 0;
    });

function drawMap(state) {
    if (state) $("#body").css("visibility", "hidden");
    $.ajax({
        type: "get",
        dataType: "json",
        scriptCharset: "utf-8",
        url: url + new Date().getTime(),
        data: "",
        success: function(data) {
            setData(data);
        },
        error: function() {
            console.log("request----error!")
        }
    });

    function setData(data) {
        startDrawMap(data);
    }

    function startDrawMap(result) {
        $("#body").css("visibility", "visible");
        $("#loadingpic").css("display","none");
        var nodes = treemap.nodes(result);
        var zntyMapData = nodes[0];
        zntyInitMap(w, zntyMapData, selectedColor);
    }
    function hqrepeat(){
        var indexHq = window["indexHq"];
        var date = (indexHq.Summary.hqtime).substr(0, 8);
        var time = (indexHq.Summary.hqtime).substr(8);
        date = date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6);
        time = time.substr(0, 2) + ":" + time.substr(2, 2) + ":" + time.substr(4, 2);
        $("#hqTimeTxt").text("行情获取时间：" + date + " " + time);
    }
    //hqrepeat();
    clearTimeout(window.timer);
    window.timer = setTimeout(hqrepeat, 2 * 1000);
}

function getRangeLegend(colorArr, valueRangeArr) {
    var map_scaleHtml = '<img src="http://www.z3quant.com/dbus/img/shy_imgs/you.png" alt="" id="legend-close" class="legend-switch"><img src="http://www.z3quant.com/dbus/img/shy_imgs/zuo.png" alt="" id="legend-open" class="legend-switch">';
    for (var i = 0; i < colorArr.length; i++) {
        map_scaleHtml += '<div class="step" style="background:' + colorArr[i] + ';">' + valueRangeArr[i] + '</div>'
    }
    $('.map_scale').html(map_scaleHtml);
}

$(function() {
    var color1dArr = ['#00d641', '#1aa448', '#0e6f2f', '#085421', '#424453', '#6d1414', '#961010', '#be0808', '#e41414'], //涨跌幅1日颜色
        color1wArr = ['#00d641', '#1aa448', '#0e6f2f', '#085421', '#424453', '#6d1414', '#961010', '#be0808', '#e41414'], //涨跌幅1周颜色
        color1mArr = ['#00d641', '#1aa448', '#0e6f2f', '#085421', '#424453', '#6d1414', '#961010', '#be0808', '#e41414'], //涨跌幅1月颜色
        colorallArr = ['#00d641', '#1aa448', '#0e6f2f', '#085421', '#424453', '#6d1414', '#961010', '#be0808', '#e41414'], //今年以来涨跌幅颜色
        colorPeArr = ['#e41414', '#be0808', '#961010', '#6d1414', '#424453', '#085421', '#0e6f2f', '#1aa448', '#00d641'], //市盈率

        colorArrWrap = [color1dArr, color1wArr, color1mArr, colorallArr, colorPeArr],
        valueRange1dArr = ['-4%', '-3%', '-2%', '-1%', '0%', '1%', '2%', '3%', '4%'], //图例1日涨跌幅数值
        valueRange1wArr = ['-8%', '-6%', '-4%', '-2%', '0%', '2%', '4%', '6%', '8%'], //图例1周涨跌幅数值
        valueRange1mArr = ['-12%', '-9%', '-6%', '-3%', '0%', '3%', '6%', '9%', '12%'], //图例1月涨跌幅数值
        valueRangeallArr = ['-32%', '-24%', '-16%', '-8%', '0%', '8%', '16%', '24%', '32%'], //图例今年以来涨跌幅数值
        valueRangePeArr = [0, 15, 30, 45, 60, 75, 90, 105, 120], //市盈率
        valueArrWrap = [valueRange1dArr, valueRange1wArr, valueRange1mArr, valueRangeallArr, valueRangePeArr];
    getRangeLegend(colorArrWrap[0], valueArrWrap[0]);
    drawMap();
    $('.scgl_s1 .navBox li:nth-child(-n+5)').click(function() {
        $(this).addClass('cur').siblings().removeClass('cur');
        selectedColor = $(this).attr('data-key');
        type = $(this).attr('data-type');
        var index = $(this).attr('data-index');
        getRangeLegend(colorArrWrap[index], valueArrWrap[index]);
        $("#loadingpic").css("display","block");
        drawMap(true);
    });
    $('#enlage').on('click', function() {
        $(window).unbind('resize');
        $('.g_header,.g_footer,.view,.sidebar').hide();
        $('.narrow').show();
        $('.content-view-map').css({ 'padding-left': '0px', 'padding-right': '0px' });
        $('.map_bt').addClass('map_bt_max');
        $('.map_bt').removeClass('map_bt_min');
        $('.map_scale').removeClass('map_scale_min');
        $('.map_scale').addClass('map_scale_max');
        $('.zn_tip').hide();
        $('#legend-close').show();
        $('#legend-open').hide();
        drawMap(selectedColor, window.ignoreAuth);
    });
    $('#narrow').on('click', function() {
        $(window).resize(function() {
            window.location.reload();
        });
        $('.g_header,.g_footer,.view,.sidebar').show();
        $('.narrow').hide();
        $('.content-view-map').css({ 'padding-left': '250px', 'padding-right': '15px' });
        $('.map_bt').removeClass('map_bt_max');
        $('.map_bt').addClass('map_bt_min');
        $('.map_scale').addClass('map_scale_min');
        $('.map_scale').removeClass('map_scale_max');
        $('.zn_tip').show();
        $('#legend-close').hide();
        $('#legend-open').hide();
        $('.step').show();
        drawMap(selectedColor, window.ignoreAuth);
    });
    $(window).resize(function() {
        window.location.reload();
    });
});