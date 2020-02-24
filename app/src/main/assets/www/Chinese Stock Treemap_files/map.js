var zntyMapPerf = {};
var tmpCode = "";
var zntyMapAdditional = {};
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

function zntyInitMap(width, mapData, color, ignoreAuth) {
    restoreParents(mapData);
    zntyRestorePerf(mapData);
    zntyInitCanvas(mapData, "sec", "", width, color, "", "", true, ignoreAuth);
}

function getBrowser() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1]:
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    if (Sys.chrome) {
        return 1;
    };
}
var treemap;

function drawMap(color, ignoreAuth) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 10;
    $('#body').height(h);
    var w = $('#body').width();
    var legend_w = $('.map_scale').outerWidth(true);
    $('.zn_tip').width(w - legend_w - 10);
    treemap = d3.layout.treemap()
        .sort(function(d1, d2) {
            return d1.scale - d2.scale;
        })
        .size([w, h])
        .value(function(d) {
            return d.scale;
            //return 1;
        }).padding(function(d) {
            if (d.depth === 1) {
                return [17, 1, 1, 1];
            } else if (d.depth === 2) {
                return [12, 1, 2, 1];
            }
            return 0;
        });
    $.getJSON("http://www.z3quant.com/openapi/openjson/tx/" + (tmpCode ? "auth/" : "") + tmpCode + ".json", function(result) {
        // if (result.errCode === -100) {
        //     document.location.href = "http://www.z3quant.com/dbus/sign.shtml?redirectUrl=" + "http://www.z3quant.com/dbus/map.shtml";
        // }
        var nodes = treemap.nodes(result);
        var json = "";
        var dateJson = "";
        var now = new Date();
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].condition != "" && nodes[i].condition != null) {
                if ($('#select-change').val() == "act_date") {
                    var tmpDate = new Date(nodes[i].condition);
                    nodes[i].condition = tmpDate > now ? -1 : 1;
                    dateJson += ",\"" + nodes[i].name + "\":\"" + dateFormatUtil(tmpDate) + "\"";
                }
                json += ",\"" + nodes[i].name + "\":" + nodes[i].condition;
            }
        }
        if ($('#select-change').val() == "act_date") {
            dateJson = "{" + dateJson.substr(1) + "}";
        }
        json = "{" + json.substr(1) + "}";
        if ($('#select-change').val() == "act_date") {
            zntyMapAdditional = JSON.parse(dateJson);
        } else {
            zntyMapAdditional = {};
        }
        zntyMapPerf = JSON.parse(json);

        var zntyMapData = nodes[0];
        zntyInitMap(w, zntyMapData, color, ignoreAuth);
    })
}

//返回 01-12 的月份值
function getMonth(date) {
    var month = "";
    month = date.getMonth() + 1; //getMonth()得到的月份是0-11
    if (month < 10) {
        month = "0" + month;
    }
    return month;
}
//返回01-30的日期
function getDay(date) {
    var day = "";
    day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return day;
}

function dateFormatUtil(date) {
    var dateTypeDate = "";
    dateTypeDate += date.getFullYear(); //年
    dateTypeDate += "-" + getMonth(date); //月
    dateTypeDate += "-" + getDay(date); //日
    return dateTypeDate;
}

function getRangeLegend(colorArr, valueRangeArr) {
    var map_scaleHtml = '<img src="./Chinese Stock Treemap_files/you.png" alt="" id="legend-close" class="legend-switch"><img src="./Chinese Stock Treemap_files/zuo.png" alt="" id="legend-open" class="legend-switch">';
    for (var i = 0; i < colorArr.length; i++) {
        map_scaleHtml += '<div class="step" style="background:' + colorArr[i] + ';">' + valueRangeArr[i] + '</div>'
    }
    $('.map_scale').html(map_scaleHtml);
    $('#legend-close').on('click', function(e) {
        e.stopPropagation();
        $(this).hide();
        $('.step').hide();
        $('#legend-open').show();
    });
    $('#legend-open').on('click', function(e) {
        e.stopPropagation();
        $(this).hide();
        $('.step').show();
        $('#legend-close').show();
    });
}
$('.left_nav li').on('click', function() {
    $('.bubSearchResult').hide();
    $('.left_inp1').val('');
    var codeArr = ['', '000001.SH', '399001.SZ', 'mainSH', 'mainSZ', '399006.SZ', '399005.SZ'];
    $('.left_nav li').removeClass('active');
    $(this).addClass('active');
    tmpCode = codeArr[$(this).index()];
    var selectedColor = $('#select-change option:selected').attr('color');
    drawMap(selectedColor);
});
$(function() {
    $('#select-change').val('mkt_idx.cur_chng_pct');
    var color1dArr = ['#00d641', '#1aa448', '#0e6f2f', '#085421', '#424453', '#6d1414', '#961010', '#be0808', '#e41414'], //涨跌幅1日颜色
        color1wArr = ['#00d641', '#1aa448', '#0e6f2f', '#085421', '#424453', '#6d1414', '#961010', '#be0808', '#e41414'], //涨跌幅1周颜色
        color1mArr = ['#00d641', '#1aa448', '#0e6f2f', '#085421', '#424453', '#6d1414', '#961010', '#be0808', '#e41414'], //涨跌幅1月颜色
        color3mArr = ['#00d641', '#1aa448', '#0e6f2f', '#085421', '#424453', '#6d1414', '#961010', '#be0808', '#e41414'], //涨跌幅3月颜色
        color6mArr = ['#00d641', '#1aa448', '#0e6f2f', '#085421', '#424453', '#6d1414', '#961010', '#be0808', '#e41414'], //涨跌幅6月颜色
        color1yArr = ['#00d641', '#1aa448', '#0e6f2f', '#085421', '#424453', '#6d1414', '#961010', '#be0808', '#e41414'], //涨跌幅1年颜色
        colorallArr = ['#00d641', '#1aa448', '#0e6f2f', '#085421', '#424453', '#6d1414', '#961010', '#be0808', '#e41414'], //今年以来涨跌幅颜色
        colorPeArr = ['#e41414', '#be0808', '#961010', '#6d1414', '#424453', '#085421', '#0e6f2f', '#1aa448', '#00d641'], //市盈率
        colorFpeArr = ['#e41414', '#be0808', '#961010', '#6d1414', '#424453', '#085421', '#0e6f2f', '#1aa448', '#00d641'], //预测市盈率
        colorPEGArr = ['#e41414', '#be0808', '#961010', '#6d1414', '#424453', '#085421', '#0e6f2f', '#1aa448', '#00d641'], //PEG
        colorPsArr = ['#e41414', '#be0808', '#961010', '#6d1414', '#424453', '#085421', '#0e6f2f', '#1aa448', '#00d641'], //市销率
        colorPbArr = ['#e41414', '#be0808', '#961010', '#6d1414', '#424453', '#085421', '#0e6f2f', '#1aa448', '#00d641'], //市净率
        colorEpsArr = ['#00d641', '#1aa448', '#0e6f2f', '#085421', '#424453', '#6d1414', '#961010', '#be0808', '#e41414'], //EPS增长率
        colorRelvolArr = ['#3c404c', '#415379', '#3c649f', '#1f69c9', '#228cd4', '#3bb0d9', '#3dd2e8', '#1de1fe', '#00fcff'], //相对成交量
        colorDivArr = ['#1d1717', '#301919', '#532a2a', '#6d2525', '#8d2929', '#a82323', '#ce1111', '#e41414', '#ff0000'], //股息率
        colorEdArr = ['#20A29A', '#BA5297'], //业绩公布日
        colorArrWrap = [color1dArr, color1wArr, color1mArr, color3mArr, color6mArr, color1yArr, colorallArr, colorRelvolArr, colorPEGArr, colorPsArr, colorPbArr, colorDivArr, colorPeArr, colorFpeArr, colorEpsArr, colorEdArr],
        valueRange1dArr = ['-4%', '-3%', '-2%', '-1%', '0%', '1%', '2%', '3%', '4%'], //图例1日涨跌幅数值
        valueRange1wArr = ['-8%', '-6%', '-4%', '-2%', '0%', '2%', '4%', '6%', '8%'], //图例1周涨跌幅数值
        valueRange1mArr = ['-12%', '-9%', '-6%', '-3%', '0%', '3%', '6%', '9%', '12%'], //图例1月涨跌幅数值
        valueRange3mArr = ['-24%', '-18%', '-12%', '-6%', '0%', '6%', '12%', '18%', '24%'], //图例3月涨跌幅数值
        valueRange6mArr = ['-32%', '-24%', '-16%', '-8%', '0%', '8%', '16%', '24%', '32%'], //图例6月涨跌幅数值
        valueRange1yArr = ['-36%', '-27%', '-18%', '-9%', '0%', '9%', '18%', '27%', '36%'], //图例1年涨跌幅数值
        valueRangeallArr = ['-32%', '-24%', '-16%', '-8%', '0%', '8%', '16%', '24%', '32%'], //图例今年以来涨跌幅数值
        valueRangeRelvolArr = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8], //图例相对成交量数值
        valueRangePeArr = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8], 	//[0, 15, 30, 45, 60, 75, 90, 105, 120], //市盈率
        valueRangeFpeArr = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8],  	//[0, 15, 30, 45, 60, 75, 90, 105, 120], //预测市盈率
        valueRangePEGArr = [0, 0.5, 1, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0], //PEG
        valueRangePsArr = [0, 2, 4, 6, 8, 10, 12, 14, 16], //市销率
        valueRangePbArr = [0, 1.2, 2.4, 3.6, 4.8, 6.0, 7.2, 8.4, 9.6], //市净率
        valueRangeDivArr = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6], //股息率
        valueRangeEpsArr = ['-36%', '-27%', '-18%', '-9%', '0%', '9%', '18%', '27%', '36%'], //EPS增长率
        valueRangeEdArr = ['业绩公布前', '业绩公布后'], //业绩公布日
        valueArrWrap = [valueRange1dArr, valueRange1wArr, valueRange1mArr, valueRange3mArr, valueRange6mArr, valueRange1yArr, valueRangeallArr, valueRangeRelvolArr, valueRangePEGArr, valueRangePsArr, valueRangePbArr, valueRangeDivArr, valueRangePeArr, valueRangeFpeArr, valueRangeEpsArr, valueRangeEdArr];
    getRangeLegend(colorArrWrap[0], valueArrWrap[0]);
    var selectedColor = '';
    drawMap(selectedColor, true);
    $('#select-change').change(function() {
        $('.bubSearchResult').hide();
        $('.left_inp1').val('');
        var index = $('#select-change option:selected').index();
        getRangeLegend(colorArrWrap[index], valueArrWrap[index]);
        selectedColor = $('#select-change option:selected').attr('color');
        $(this).blur();
        drawMap(selectedColor);
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