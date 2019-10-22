// 图表的外边距
var margin = { top: 30, right: 300, bottom: 10, left: 300 };
// 图表高度
var chartHeight = 800;
// 图表宽度
var chartWidth = 800;
// svg高度
var svgHeight = chartHeight + margin.top + margin.bottom;
// svg宽度
var svgWidth = chartWidth + margin.left + margin.right;
var svg = d3.select('body')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);
// 添加容器用来画图方便整体操作
var svg_g = svg.append('g').attr('class', 'container');
// 年份:展示当前年的数据
var yearStart = 2000;
var yAxis = null;
var xAxis = null;
function draw(chartData) {
  //年份
  var yearIndex = yearStart.toString();
  //过度动画
  var t = d3.transition().duration(1000);
  // x轴比例尺
  var x = d3.scaleLinear()
    .domain([0, d3.max(chartData, d => Number(d[yearIndex]))])
    .range([margin.left, svgWidth - margin.right])
  // x轴
  // 如有需要请打开注释
  // if (xAxis) {
  //   xAxis.transition(t).call(d3.axisTop(x))
  // } else {
  //   xAxis = svg_g.append('g')
  //     .attr('class', 'xAxisC')
  //     .attr("transform", `translate(0,${margin.top})`)
  //     .call(d3.axisTop(x))
  // }

  // y轴比例尺
  var y = d3.scaleBand()
    .domain(chartData.map(d => d.CountryName))
    .range([margin.top, svgHeight - margin.bottom])
    .padding(0.1)
  // y轴
  if (yAxis) {
    // 如果已存在y轴，调用过渡动画
    yAxis.transition(t).call(d3.axisLeft(y))
  } else {
    // 如果没有y轴，新建
    yAxis = svg_g.append('g')
      .attr('class', 'yAxisC')
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
  }
  // 需要更新的或者说需要调用过渡动画的
  var dataUpdate = svg_g
    .selectAll('g.rect')
    .data(chartData, d => d.CountryName);

  // 需要删除的元素直接移除 如需要删除的动画效果请参考更新的动画
  dataUpdate.exit().remove();

  //更新的元素调用过渡动画
  dataUpdate.selectAll('rect')
    .transition(t)
    .attr("x", x(0))
    .attr("y", d => y(d.CountryName))
    .attr("width", d => x(Number(d[yearIndex])) - x(0))
    .attr("height", y.bandwidth());
  dataUpdate.selectAll('text')
    .transition(t)
    .attr("x", d => x(Number(d[yearIndex])) - 4)
    .attr("y", d => y(d.CountryName) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text(d => Number(d[yearIndex]).toLocaleString());

  //需要新增的元素直接添加 
  var dataEnter = dataUpdate.enter()
    .append('g')
    .attr("class", "rect");

  dataEnter.append("rect")
    .style("fill", '#5DADE2')
    .attr("x", x(0))
    .attr("y", d => y(d.CountryName))
    .attr("width", d => x(Number(d[yearIndex])) - x(0))
    .attr("height", y.bandwidth());

  dataEnter.append("text")
    .attr("x", d => x(Number(d[yearIndex])) - 4)
    .attr("y", d => y(d.CountryName) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text(d => Number(d[yearIndex]).toLocaleString());
}

function render() {
  var yearIndex = yearStart.toString();
  // 格式化数据用 根据你自己的实际情况来
  // gdpData 在data.js里
  var chartData = gdpData.sort((a, b) => Number(b[yearIndex]) - Number(a[yearIndex]));
  // 调用画图方法
  draw(chartData);
}
render();
// 模拟异步请求
var timer = setInterval(function () {
  // 年份加1
  yearStart += 1;
  // 数据只到2017年 超过2017年重新开始
  if (yearStart > 2017) { yearStart = 2000 }
  d3.select('#year').html(yearStart)
  render();
}, 1500);