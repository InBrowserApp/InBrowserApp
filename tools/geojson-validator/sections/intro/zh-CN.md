## 如何检查 GeoJSON 文件

打开 .geojson 或 .json 文件，或粘贴 GeoJSON 文档并选择 **校验 GeoJSON**。使用 **试用示例** 可查看有效的 FeatureCollection。您可以编辑输入并再次检查。文件和粘贴的文本保留在浏览器中。

## 校验器检查什么

工具首先检查 JSON 语法，然后检查 GeoJSON 结构，包括 FeatureCollection、Feature、GeometryCollection 和各类几何图形。位置按照 WGS 84 的经度、纬度顺序排列。校验器检查坐标范围、线和环的位置最少数量、环是否闭合、要素属性和边界框结构。空要素集合和 null 要素几何图形都是有效的。

## 查找并修复问题

`$.features[0].geometry.coordinates` 这样的错误路径指向第一个要素的坐标。从指定字段入手，修改后再次校验。结果描述的是文件结构。几何拓扑问题（例如自相交或重叠）需要单独进行 GIS 检查。如需直观查看有效结果，可在 [GeoJSON 查看器](../geojson-viewer/)中打开。
