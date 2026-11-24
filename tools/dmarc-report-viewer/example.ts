const example = `<?xml version="1.0" encoding="UTF-8"?>
<feedback xmlns="urn:ietf:params:xml:ns:dmarc-2.0">
  <version>1.0</version>
  <report_metadata>
    <org_name>Example Mail</org_name>
    <email>dmarc@example.net</email>
    <report_id>example-2026-11-23</report_id>
    <date_range><begin>1795392000</begin><end>1795478399</end></date_range>
  </report_metadata>
  <policy_published>
    <domain>example.com</domain>
    <p>quarantine</p><sp>reject</sp><adkim>r</adkim><aspf>r</aspf>
  </policy_published>
  <record>
    <row><source_ip>192.0.2.10</source_ip><count>140</count>
      <policy_evaluated><disposition>pass</disposition><dkim>pass</dkim><spf>pass</spf></policy_evaluated>
    </row>
    <identifiers><header_from>example.com</header_from></identifiers>
    <auth_results>
      <dkim><domain>example.com</domain><selector>mail</selector><result>pass</result></dkim>
      <spf><domain>example.com</domain><scope>mfrom</scope><result>pass</result></spf>
    </auth_results>
  </record>
  <record>
    <row><source_ip>2001:db8::25</source_ip><count>24</count>
      <policy_evaluated><disposition>pass</disposition><dkim>fail</dkim><spf>pass</spf></policy_evaluated>
    </row>
    <identifiers><header_from>news.example.com</header_from></identifiers>
    <auth_results><spf><domain>news.example.com</domain><result>pass</result></spf></auth_results>
  </record>
  <record>
    <row><source_ip>192.0.2.55</source_ip><count>12</count>
      <policy_evaluated><disposition>quarantine</disposition><dkim>fail</dkim><spf>fail</spf></policy_evaluated>
    </row>
    <identifiers><header_from>example.com</header_from></identifiers>
    <auth_results><dkim><domain>example.net</domain><selector>provider</selector><result>pass</result></dkim></auth_results>
  </record>
  <record>
    <row><source_ip>192.0.2.55</source_ip><count>4</count>
      <policy_evaluated><disposition>none</disposition><dkim>fail</dkim><spf>fail</spf>
        <reason><type>mailing_list</type></reason>
      </policy_evaluated>
    </row>
    <identifiers><header_from>example.com</header_from></identifiers>
    <auth_results />
  </record>
</feedback>`

export { example }
