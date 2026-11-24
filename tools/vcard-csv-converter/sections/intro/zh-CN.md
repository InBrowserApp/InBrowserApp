## 将 VCF 联系人导出为 CSV 表格

选择**vCard 转 CSV**，打开 `.vcf` 文件或粘贴文件内容，然后选择**转换**。每位联系人在 CSV 中占一行。下载文件后，可以在 Excel、Google 表格等电子表格应用中整理或编辑通讯录。选择**试用示例**，可以查看两种转换方向所需的输入格式。

## 将 CSV 联系人列表转成 vCard

选择**CSV 转 vCard**，输入 UTF-8 编码的 CSV，并将列名放在第一行。本工具可识别 `Full Name`、`First Name`、`Last Name`、`Email`、`Phone`、`Company`、`Job Title`、`Website`、`Address`、`Notes` 等列名，也支持通讯录导出文件中常见的其他写法。例如，使用 `First Name,Last Name,Email` 作为表头，可生成带有显示名称及独立姓、名字段的联系人。

下载生成的 VCF 文件，即可将联系人导入通讯录。CSV 中的每一行联系人数据都会生成一条 vCard 3.0 记录。

## 了解 CSV 能保留哪些信息

CSV 使用二维表格存储信息。本工具保留每张名片中的第一个邮箱、电话号码、网址和地址。照片、字段标签和自定义 vCard 属性保留在原始 VCF 文件中。如果需要完整备份，请保留原文件。转换在浏览器本地完成。
