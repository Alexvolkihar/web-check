// A term's meaning, with optional wording that replaces it when a row passes or fails
export interface Term {
  title: string;
  definition: string;
  pass?: string;
  fail?: string;
}

export const glossary = {
  // Certificates
  'certificate-trust': {
    title: 'Certificate Trust',
    definition: 'Whether the certificate is valid for this hostname and was issued by an authority browsers trust.',
    pass: 'Browsers trust this certificate, so visitors get a secure connection with no warnings.',
    fail: 'Browsers show visitors a full-page security warning instead of the site.',
  },
  'certificate-expiry': {
    title: 'Certificate Expiry',
    definition:
      'Certificates are only valid until their expiry date, after which browsers refuse them.',
    fail: 'Renew it soon, or visitors will see a security warning instead of the site.',
  },
  'certificate-transparency': {
    title: 'Certificate Transparency',
    definition:
      'Public logs of every certificate issued, so one issued by mistake or by an attacker gets noticed.',
    fail: 'Chrome and Safari require proof a certificate was logged, so they may refuse this one.',
  },
  caa: {
    title: 'CAA Records',
    definition:
      'DNS records naming which certificate authorities may issue certificates for the domain.',
  },

  // TLS
  'tls-version': {
    title: 'TLS Version',
    definition:
      'The version of TLS the connection used. Newer versions are faster and drop weaker encryption.',
    pass: 'TLS 1.3 is the newest version, with the fastest and strongest handshake.',
    fail: "This isn't the newest version. TLS 1.3 is faster, and TLS 1.0 and 1.1 have known weaknesses.",
  },
  'tls-1-3': {
    title: 'TLS 1.3',
    definition: 'The newest version of TLS, with a faster handshake and only strong encryption.',
    fail: 'Without it, visitors miss out on faster and more secure connections.',
  },
  'legacy-tls': {
    title: 'TLS 1.0 and 1.1',
    definition:
      'Old versions of TLS with known weaknesses, which every major browser dropped in 2020.',
    pass: "Disabled, so connections can't be pushed down to these weaker versions.",
    fail: 'Still enabled, which leaves room for downgrade attacks. Turn them off.',
  },
  'ssl-labs-grade': {
    title: 'SSL Labs Grade',
    definition: "Qualys SSL Labs' overall rating of a server's HTTPS setup, from A+ down to F.",
    fail: 'Below an A, so part of the HTTPS setup is worth fixing.',
  },
  'forward-secrecy': {
    title: 'Forward Secrecy',
    definition:
      "Each connection gets its own temporary key, so a stolen server key can't decrypt past traffic.",
    fail: "If the server's private key is ever stolen, recorded traffic could be decrypted.",
  },
  'session-resumption': {
    title: 'Session Resumption',
    definition:
      'Returning visitors can reuse an earlier secure session, skipping part of the handshake.',
  },
  'ocsp-stapling': {
    title: 'OCSP Stapling',
    definition:
      "The server attaches proof that its certificate hasn't been revoked, so browsers don't have to ask the issuer.",
    fail: 'Browsers may ask the issuer directly, which is slower and tells it which sites visitors open.',
  },
  http2: {
    title: 'HTTP/2',
    definition: 'A faster version of HTTP that loads many files at once over a single connection.',
  },
  renegotiation: {
    title: 'Renegotiation',
    definition:
      'Lets the browser and server agree new settings partway through a connection. Only the secure kind is safe.',
    fail: 'Insecure renegotiation lets an attacker slip their own data into the start of a connection.',
  },
  'fallback-scsv': {
    title: 'Fallback SCSV',
    definition: 'Stops attackers forcing a connection down to an older, weaker version of TLS.',
  },
  chacha20: {
    title: 'ChaCha20',
    definition:
      'A cipher that runs faster than AES on phones and other devices without AES hardware.',
  },
  aead: {
    title: 'AEAD Ciphers',
    definition:
      'Modern ciphers like AES-GCM and ChaCha20, which encrypt and check data in one step to avoid a whole class of attacks.',
    fail: 'Without them, connections fall back to older ciphers with known weaknesses.',
  },
  'cbc-ciphers': {
    title: 'CBC Ciphers',
    definition: 'An older cipher mode behind attacks like POODLE and Lucky 13.',
    pass: 'Not offered, so connections only use modern ciphers.',
    fail: 'Still offered for old devices, though modern browsers never need it.',
  },
  'tls-compression': {
    title: 'TLS Compression',
    definition:
      'Compressing data before encrypting it, which the CRIME attack uses to steal cookies.',
    fail: 'Turn it off, as it leaves the site open to CRIME.',
  },
  'key-exchange-reuse': {
    title: 'Key Exchange Reuse',
    definition:
      'Reusing the same temporary key exchange values across connections, which weakens forward secrecy.',
  },
  'weak-dh-primes': {
    title: 'Weak DH Primes',
    definition:
      'Widely shared Diffie-Hellman groups that are too small, so a well-funded attacker may already have broken them.',
  },
  'client-compatibility': {
    title: 'Client Compatibility',
    definition: 'Whether a browser or device can complete a secure connection to the site.',
    fail: "This client can't connect. That's usually fine for very old devices, but check your visitors don't use it.",
  },

  // TLS vulnerabilities
  heartbleed: {
    title: 'Heartbleed',
    definition:
      'A bug in old OpenSSL versions that let anyone read server memory, including private keys and passwords.',
  },
  poodle: {
    title: 'POODLE',
    definition:
      'An attack on SSL 3.0 that decrypts data a byte at a time. Disabling SSL 3.0 fixes it.',
  },
  'poodle-tls': {
    title: 'POODLE (TLS)',
    definition:
      "A version of POODLE that works against TLS servers which don't check padding properly.",
  },
  'zombie-poodle': {
    title: 'Zombie POODLE',
    definition:
      'A padding oracle in some servers that brings POODLE-style attacks back to CBC ciphers.',
  },
  goldendoodle: {
    title: 'GOLDENDOODLE',
    definition:
      'A faster padding oracle attack on CBC ciphers, found in some firewalls and load balancers.',
  },
  'sleeping-poodle': {
    title: 'Sleeping POODLE',
    definition: 'Another padding oracle on CBC ciphers, found in some network devices.',
  },
  'zero-length-padding-oracle': {
    title: 'Zero-Length Padding Oracle',
    definition:
      'An OpenSSL bug (CVE-2019-1559) that lets an attacker decrypt traffic on CBC ciphers.',
  },
  freak: {
    title: 'FREAK',
    definition:
      'Tricks a connection into using deliberately weak 1990s export encryption, which can be cracked in hours.',
  },
  logjam: {
    title: 'Logjam',
    definition: 'Downgrades the key exchange to weak Diffie-Hellman groups that can be broken.',
  },
  drown: {
    title: 'DROWN',
    definition:
      'Uses any server that still supports SSL 2.0 with the same key to decrypt modern TLS traffic.',
  },
  'ccs-injection': {
    title: 'CCS Injection',
    definition:
      'An OpenSSL bug (CVE-2014-0224) that lets an attacker force weak keys and read traffic.',
  },
  'openssl-padding-oracle': {
    title: 'OpenSSL Padding Oracle',
    definition: 'An OpenSSL bug (CVE-2016-2107) that lets an attacker decrypt AES-CBC traffic.',
  },
  robot: {
    title: 'ROBOT',
    definition:
      "A revived attack on RSA key exchange that can decrypt traffic, or sign messages with the server's key.",
  },
  ticketbleed: {
    title: 'Ticketbleed',
    definition: 'A bug in some F5 load balancers that leaks memory through TLS session tickets.',
  },

  // HSTS
  'strict-transport-security': {
    title: 'HSTS',
    definition:
      "Tells browsers to only ever connect over HTTPS, so visitors can't be downgraded to plain HTTP.",
    pass: 'Browsers that have visited before will always use HTTPS for this site.',
    fail: "Browsers aren't fully held to HTTPS, so a request over plain HTTP could be intercepted.",
  },
  'hsts-max-age': {
    title: 'HSTS max-age',
    definition:
      'How long browsers remember to only use HTTPS. The HSTS preload list needs at least a year.',
    fail: "Under a year, so browsers forget sooner and the site can't join the preload list.",
  },
  'hsts-include-subdomains': {
    title: 'includeSubDomains',
    definition:
      'Applies HSTS to every subdomain too, so none of them can be reached over plain HTTP.',
    fail: 'Subdomains are left out, so they can still be loaded over plain HTTP.',
  },
  'hsts-preload': {
    title: 'HSTS Preload',
    definition:
      'Asks browsers to build the site into their HTTPS-only list, protecting even the very first visit.',
  },

  // Security headers
  'content-security-policy': {
    title: 'Content-Security-Policy',
    definition:
      'Lists where a page may load scripts and other files from, which blocks most cross-site scripting.',
    fail: 'Without a strict policy, scripts injected into the page are more likely to run.',
  },
  'x-content-type-options': {
    title: 'X-Content-Type-Options',
    definition:
      "Stops browsers guessing a file's type, so an uploaded file can't be run as a script.",
  },
  'x-frame-options': {
    title: 'X-Frame-Options',
    definition: 'Stops other sites showing this page in a frame, which blocks clickjacking.',
  },
  'referrer-policy': {
    title: 'Referrer-Policy',
    definition:
      'Controls how much of the current URL is shared with other sites when visitors follow links or load files.',
    fail: 'Without a strict policy, page paths and query strings may be shared with other sites.',
  },
  'permissions-policy': {
    title: 'Permissions-Policy',
    definition:
      'Turns off browser features like the camera, microphone and location for the page and anything it embeds.',
  },
  'cross-origin-opener-policy': {
    title: 'Cross-Origin-Opener-Policy',
    definition:
      "Keeps the page in its own window group, so pop-ups and other sites can't reach into it.",
  },
  'cross-origin-resource-policy': {
    title: 'Cross-Origin-Resource-Policy',
    definition:
      "Stops other sites loading this site's files, which guards against Spectre-style data leaks.",
  },
  'cross-origin-embedder-policy': {
    title: 'Cross-Origin-Embedder-Policy',
    definition:
      'Only lets the page load files from other sites that allow it, which unlocks features that need Spectre protection.',
  },
  'x-xss-protection': {
    title: 'X-XSS-Protection',
    definition:
      'An old browser filter for cross-site scripting, since removed from browsers. It should now be set to 0.',
    pass: 'Turned off, as recommended.',
    fail: 'The old filter is on, which can open new security holes in older browsers. Set it to 0.',
  },
  'server-disclosure': {
    title: 'Server Software Headers',
    definition:
      'Headers like Server and X-Powered-By that name the software, and often the version, a site runs.',
    fail: 'This tells attackers which known flaws to try. Remove the version, or the header.',
  },

  // Page content
  'mixed-content': {
    title: 'Mixed Content',
    definition:
      'Files loaded over plain HTTP on an HTTPS page, which can be read or changed in transit.',
    pass: 'Everything on the page loads over HTTPS.',
  },
  'upgrade-insecure-requests': {
    title: 'Upgrade Insecure Requests',
    definition:
      'A CSP setting that makes browsers fetch any HTTP links on the page over HTTPS instead.',
  },
  sri: {
    title: 'Subresource Integrity (SRI)',
    definition:
      "An integrity hash on a script or stylesheet lets the browser check the file hasn't been altered, and refuse it if it has.",
  },
  'integrity-policy': {
    title: 'Integrity-Policy',
    definition: 'A header that makes browsers refuse any script without an SRI hash.',
    fail: 'Scripts without a hash are being blocked, which may break part of the page.',
  },
  'cookie-security': {
    title: 'Cookie Security Flags',
    definition:
      'Secure keeps a cookie off plain HTTP, HttpOnly hides it from scripts, and SameSite stops other sites sending it.',
    pass: 'All three flags are set, so this cookie is well protected.',
  },

  // Email
  spf: {
    title: 'SPF',
    definition:
      'A DNS record listing the servers allowed to send email for the domain, so receivers can spot forged mail.',
    fail: 'Without a working record, others can send email that appears to come from this domain.',
  },
  dkim: {
    title: 'DKIM',
    definition:
      "Signs outgoing email with a key published in DNS, so receivers can check it came from the domain and wasn't changed.",
  },
  dmarc: {
    title: 'DMARC',
    definition:
      'Tells receivers what to do with mail that fails SPF and DKIM, and where to send reports about it.',
    fail: 'Spoofed mail claiming to be from this domain may still be delivered.',
  },
  bimi: {
    title: 'BIMI',
    definition:
      "Shows a brand's logo next to its emails in supported inboxes, once DMARC is enforced.",
  },
  'mta-sts': {
    title: 'MTA-STS',
    definition:
      'Makes other mail servers use encrypted, verified connections when delivering email to this domain.',
  },
  'tls-rpt': {
    title: 'TLS-RPT',
    definition: 'Asks other mail servers to report when they fail to deliver mail here securely.',
  },
  dane: {
    title: 'DANE',
    definition:
      "Publishes the mail server's certificate details in signed DNS records, so senders can check it without a certificate authority.",
  },

  // DNS
  dnskey: {
    title: 'DNSKEY',
    definition: "The public keys that sign a domain's DNS records under DNSSEC.",
    fail: "Without them, the domain's DNS records aren't signed.",
  },
  'ds-record': {
    title: 'DS Record',
    definition:
      "A record in the parent zone that points to the domain's DNSKEY, so resolvers can trust its signatures.",
    fail: "Without it, resolvers can't check the signatures, so DNSSEC isn't in effect.",
  },
  'dnssec-validation': {
    title: 'DNSSEC Validation',
    definition:
      "Whether a resolver could verify the domain's DNS answers were signed and unchanged.",
    fail: "Answers can't be verified, so a forged DNS reply could send visitors to the wrong server.",
  },

  // Threats and reputation
  'safe-browsing': {
    title: 'Google Safe Browsing',
    definition:
      "Google's list of sites known for malware or phishing, which Chrome, Firefox and Safari warn visitors about.",
    fail: 'Visitors in most browsers see a red warning page instead of the site.',
  },
  'threat-scan': {
    title: 'Threat Scan',
    definition: 'A scan of the site for malware, phishing and other threats to visitors.',
  },
  phishing: {
    title: 'Phishing',
    definition:
      'Pages that pose as a trusted brand to steal logins, card details or other personal data.',
  },
  malware: {
    title: 'Malware',
    definition:
      'Software designed to harm visitors or their devices, often spread through hacked sites.',
    fail: 'URLs on this site have been reported for spreading malware.',
  },
  'dns-blocklist': {
    title: 'DNS Blocklists',
    definition:
      'Lists that privacy and family-safety DNS resolvers use to block harmful or unwanted sites.',
    fail: "Visitors using this resolver can't reach the site.",
  },
  'data-breach': {
    title: 'Data Breaches',
    definition: "Incidents where a site's user data was leaked or stolen, and later made public.",
    fail: 'Accounts from this site have been exposed, and reused passwords may be tried on other sites.',
  },
  cve: {
    title: 'Known Vulnerabilities (CVEs)',
    definition:
      'Publicly listed security flaws in the software a server runs, each with a CVE number.',
    fail: 'Attackers scan for these, so update or patch the affected software.',
  },
  'known-exploited': {
    title: 'Actively Exploited',
    definition: "Flaws on CISA's list of vulnerabilities that attackers are known to be using.",
  },
  'open-port': {
    title: 'Open Ports',
    definition:
      'Each open port is a service anyone on the internet can try to connect to, and probe for weaknesses.',
    fail: 'Unless it needs to be public, close it or limit who can reach it with a firewall.',
  },
  waf: {
    title: 'Web Application Firewall',
    definition:
      'A filter in front of a site that blocks common attacks, like SQL injection and bad bots.',
  },

  // security.txt
  'security-txt': {
    title: 'security.txt',
    definition:
      'A file at /.well-known/security.txt telling security researchers how to report a problem.',
    fail: 'Researchers who find a vulnerability may not know who to tell.',
  },
  'security-txt-signature': {
    title: 'Signed security.txt',
    definition:
      "A PGP signature proves the file came from the site's owner and hasn't been changed.",
  },
  'security-txt-contact': {
    title: 'Contact Field',
    definition: 'The required field giving an email address or link for reporting vulnerabilities.',
  },
  'security-txt-expires': {
    title: 'Expires Field',
    definition:
      'The required date after which the file counts as out of date. It should be under a year ahead.',
  },

  // Quality and visibility
  'lighthouse-performance': {
    title: 'Performance Score',
    definition: "Google Lighthouse's score for how fast the page loads and becomes usable.",
  },
  'lighthouse-accessibility': {
    title: 'Accessibility Score',
    definition:
      "Google Lighthouse's score for how usable the page is for people with disabilities, such as screen reader users.",
  },
  'lighthouse-best-practices': {
    title: 'Best Practices Score',
    definition:
      "Google Lighthouse's score for modern web practices, from using HTTPS to avoiding outdated browser features.",
  },
  'lighthouse-seo': {
    title: 'SEO Score',
    definition:
      "Google Lighthouse's score for the basics that help search engines find and show a page.",
  },
  'response-time': {
    title: 'Response Time',
    definition:
      'How long the server takes to answer. A slow first response delays everything else on the page.',
  },
  redirects: {
    title: 'Redirects',
    definition:
      'Each redirect sends the browser to another URL, adding a round trip before the page loads.',
  },
  'https-redirect': {
    title: 'HTTPS Redirect',
    definition:
      'Sends visitors who arrive over plain HTTP to the secure HTTPS version of the site.',
    fail: 'Visitors who type the address without https:// stay on an insecure connection.',
  },
  'search-crawling': {
    title: 'Search Engine Crawling',
    definition: 'robots.txt can ask search engines to stay away from some or all of a site.',
    fail: 'Google is asked to skip the whole site, so it may drop out of search results.',
  },
  'open-graph': {
    title: 'Open Graph',
    definition:
      'Tags setting the title, description and image shown when a page is shared on social media or in chat apps.',
    fail: 'Without it, apps guess what to show when the page is shared, often badly.',
  },
  'twitter-card': {
    title: 'Twitter Card',
    definition: 'Tells X (formerly Twitter) which preview style to use when the page is shared.',
  },
  'social-verification': {
    title: 'Profile Verification',
    definition:
      'Whether a social profile the site points to also points back, showing the same people run both.',
  },
  trackers: {
    title: 'Trackers',
    definition: 'Third-party services that record what visitors do, often across many sites.',
    pass: 'No known trackers load on this page.',
  },
  'ad-trackers': {
    title: 'Advertising Trackers',
    definition: 'Scripts from ad networks that follow visitors across sites to target ads at them.',
  },
  analytics: {
    title: 'Analytics',
    definition: 'Services that record how visitors use a site, such as the pages they view.',
  },
} satisfies Record<string, Term>;

export type TermId = keyof typeof glossary;

// What a term means for a row, using its pass or fail wording when it has one
export const termText = (id: TermId, passed: boolean): string => {
  const term: Term = glossary[id];
  return (passed ? term.pass : term.fail) ?? term.definition;
};
