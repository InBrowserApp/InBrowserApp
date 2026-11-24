## 为 IPFS 生成 DNSLink TXT 记录

DNSLink 可将域名或子域名指向一个内容路径。输入域名，再粘贴 IPFS CID、IPFS 路径或 IPNS 路径。在你的 DNS 服务商处新建 TXT 记录，填入生成的 **名称** 和 **TXT 值**。例如，`www.example.com` 对应的记录名称是 `_dnslink.www.example.com`。如果 DNS 管理界面会自动加上 `example.com`，在名称栏填入 `_dnslink.www` 即可。

## 检查 DNSLink 指向哪里

点击 **检查已发布的记录**，查看 Cloudflare 和 Google 的 TXT 查询结果。留空目标可查询现有配置，填写预期目标则可与已发布的值进行比较。修改记录后，在缓存过期之前，解析器可能仍返回旧值。显示的 TTL 表示该 DNS 响应还可被缓存多久。

## 更新自定义域名下的 IPFS 网站

使用 IPFS CID 可直接指向固定版本的文件，也可以使用 IPNS 路径指向可更新的名称。DNSLink 告诉支持它的客户端和网关应解析哪个内容。要通过自己的 HTTPS 域名提供这些内容，请配置支持 DNSLink 的网关，再将域名指向该网关。[IPFS 自定义域名与 DNSLink](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
