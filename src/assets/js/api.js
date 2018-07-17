// var exportUrl = "http://export.highcharts.com/";
var exportUrl = "http://localhost:7801/";

function addImage(options, selector) {
  var optionsStr = JSON.stringify(options),
    dataString = encodeURI(
      "async=true&type=jpeg&scale=3&options=" + optionsStr
    );

  $.ajax({
    type: "POST",
    data: dataString,
    url: exportUrl,
    success: function (data) {
      console.log("get the file from relative url: ", data);
      // $(selector).html('<img src="' + exportUrl + data + '"/>');
      // $(selector).attr("src", exportUrl + data);
      $(selector).attr("src", exportUrl + data);
      // console.log(selector);
      var test = $("html")
        .clone()
        .html();
      window.test = test;
    },
    error: function (err) {
      console.log("error", err.statusText);
    }
  });
}

function createDepartmentChartOptions(params) {
  var options = {
    chart: {
      type: "bar"
    },
    credits: {
      enabled: false
    },
    title: {
      align: 'left',
      style: {
        color: '#555555',
        fontSize: '24px',
        fontWeight: 'bold'
      },
      x: 40,
      text: params.title
    },
    xAxis: {
      categories: params.departments
    },
    yAxis: {
      min: 0,
      title: {
        text: params.yTitle
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      floating: true,
      borderWidth: 0,
    },
    exporting: {
      sourceHeight: 350,
      chartOptions: { subtitle: null }
    },
    series: [params.thisMonthData, params.lastMonthData]
  };

  return options;
}

function createProductivityChartOptions(params) {
  var options = {
    chart: {
      type: "column",
      backgroundColor: "#263746"
    },


    credits: {
      enabled: false
    },
    title: {
      text: null
    },
    xAxis: {
      categories: params.categories,
      labels: {
        style: {
          fontSize: "34px",
          color: "white"
        }
      },
      lineWidth: 2,
      lineColor: 'white',
      // gridLineWidth: 0,
      // minorGridLineWidth: 0,
      // lineColor: 'transparent',
      // minorTickLength: 0,
      // tickLength: 0
    },
    plotOptions: {
      series: {
        borderWidth: 0
      }
    },
    yAxis: {
      title: {
        text: null
      },
      lineWidth: 2,
      lineColor: 'white',
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      minorTickLength: 0,
      tickLength: 0
    },
    legend: {
      enabled: params.legends
    },
    exporting: {
      sourceHeight: 350,
      chartOptions: { subtitle: null }
    },
    series: params.series
  };

  return options;
}

function createDepartmentImages() {
  var params = {};

  // Incase, new depts added or removed in the current month, so, take the month with more departments
  var allDepartments =
    Data.thisMonth.departments.length > Data.lastMonth.departments.length
      ? Data.thisMonth.departments
      : Data.lastMonth.departments;

  params.departments = allDepartments.map(function (dept) {
    return dept.name;
  });

  var thisMonthDepartments = Data.thisMonth.departments;
  var lastMonthDepartments = Data.lastMonth.departments;

  var thisMonthData = {
    name: "Jun 2018", data: [], color: "#407CCA"
  };
  var lastMonthData = { name: "May 2018", data: [], color: "#56D9FE" };

  thisMonthDepartments.forEach(function (dept) {
    thisMonthData.data.push(dept.time);
  });

  lastMonthDepartments.forEach(function (dept) {
    lastMonthData.data.push(dept.time);
  });

  params.title = "Department Hours";
  params.yTitle = null;

  params.thisMonthData = thisMonthData;
  params.lastMonthData = lastMonthData;

  var totalTimeChartOptions = createDepartmentChartOptions(params);


  addImage(totalTimeChartOptions, ".dept_total_hours_chart");

  /// For Sessions
  /// Only series data in params needs to be changed

  var thisMonthData = {
    name: "Jun 2018", data: [], color: "#FF8373"
  };
  var lastMonthData = { name: "May 2018", data: [], color: "#FFDA83" };



  lastMonthDepartments.forEach(function (dept) {
    lastMonthData.data.push(dept.sessions);
  });

  thisMonthDepartments.forEach(function (dept) {
    thisMonthData.data.push(dept.sessions);
  });


  params.title = "Department Sessions";

  params.thisMonthData = thisMonthData;
  params.lastMonthData = lastMonthData;

  var totalSessionsChartOptions = createDepartmentChartOptions(params);


  addImage(totalSessionsChartOptions, ".dept_total_sessions_chart");
}

function createProductivityImages() {
  var params = {};

  params.legends = false;

  params.categories = ["June", "May"];
  // params.thisMonthData = { name: "June", data: thisMonthSessions, color: "#7094AA" };
  // params.lastMonthData = { name: "May", data: lastMonthSessions, color: "#FFDA83" };

  params.series = [
    {
      name: "Total Sessions",
      data: [{ y: Data.thisMonth.sessions, color: "#7094AA" }, { y: Data.lastMonth.sessions, color: "#FFDA83" }]
    }
  ]
  var totalSessionChartOptions = createProductivityChartOptions(params);

  addImage(totalSessionChartOptions, ".productivity_sessions_chart");


  params.series = [
    {
      name: "Total Sessions",
      data: [{ y: Data.thisMonth.time, color: "#7094AA" }, { y: Data.lastMonth.time, color: "#FF8373" }]
    }
  ]

  var totalTimeChartOptions = createProductivityChartOptions(params);

  addImage(totalTimeChartOptions, ".productivity_hours_chart");


  var minUtilDept = "";
  var minUtilTime = Number.MAX_VALUE;

  var maxUtilDept = "";
  var maxUtilTime = Number.MIN_VALUE;

  var avgUtilTitle = "Department Average"
  var avgUtilTime = 0;
  var deptCount = 0;

  Data.thisMonth.departments.forEach(function (dept, i) {
    if (dept.time > maxUtilTime) {
      maxUtilDept = dept.name,
        maxUtilTime = dept.time
    } else if (dept.time < minUtilTime) {
      minUtilDept = dept.name,
        minUtilTime = dept.time
    }

    avgUtilTime = Number(dept.time);
    deptCount += 1;
  });

  avgUtilTime = avgUtilTime / deptCount;

  var minUtilFinal = Math.round(minUtilTime);
  var avgUtilFinal = Math.round(avgUtilTime);
  var maxUtilFinal = Math.round(maxUtilTime);

  params.categories = [minUtilFinal, avgUtilFinal, maxUtilFinal];
  params.series = [
    {
      name: "Computer Utilization",
      data: [{ y: minUtilFinal, color: "#FF8373" }, { y: avgUtilFinal, color: "#7094AA" }, { y: maxUtilFinal, color: "#5AD799" }]
    }
  ]

  params.legends = false;

  var totalUtilityChartOptions = createProductivityChartOptions(params);

  addImage(totalUtilityChartOptions, ".productivity_utilization_chart");

  $(".min-util-dept").text(minUtilDept);
  $(".avg-util").text("Department Average");
  $(".max-util-dept").text(maxUtilDept);
}


$(document).ready(function () {
  createDepartmentImages();
  createProductivityImages();
});
