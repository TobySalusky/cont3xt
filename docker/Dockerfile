FROM ubuntu:20.04

ENV REACT_APP_SPUR_TOKEN=
ENV REACT_APP_CENSYS_API_ID=
ENV REACT_APP_CENSYS_API_SECRET=
ENV REACT_APP_PASSIVETOTAL_API_USER=
ENV REACT_APP_PASSIVETOTAL_API_KEY=USE_YOUR_ORGANIZATION_KEY
ENV REACT_APP_URLSCAN_KEY=
ENV REACT_APP_ABUSEIPDB_API_KEY=PLACEHOLDER-NOT_IMPLEMENTED_YET
ENV REACT_APP_DOMAINTOOLS_USERNAME=PLACEHOLDER-NOT_IMPLEMENTED_YET
ENV REACT_APP_DOMAINTOOLS_API_KEY=PLACEHOLDER-NOT_IMPLEMENTED_YET
ENV REACT_APP_VIRUSTOTAL_API_USER=
ENV REACT_APP_VIRUSTOTAL_API_KEY=
ENV REACT_APP_THREATSTREAM_URL=api.threatstream.com
ENV REACT_APP_THREATSTREAM_API_USER=
ENV REACT_APP_THREATSTREAM_API_KEY=
ENV REACT_APP_THREATSTREAM_UI_URL=ui.threatstream.com
ENV REACT_APP_ARKIME_URL=PLACEHOLDER-NOT_IMPLEMENTED_YET
ENV REACT_APP_ALIENVAULT_OTX_API_KEY=PLACEHOLDER-NOT_IMPLEMENTED_YET
ENV REACT_APP_SHODAN_KEY=

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y npm git supervisor
RUN cd /opt \
    && git clone https://github.com/TobySalusky/cont3xt \
    && cd cont3xt \
    && npm ci install \
    && npm audit fix --force \
    && npm audit fix --force \
    && npx --package express-generator express c3b \
    && git clone https://github.com/TobySalusky/cont3xtbackend \
    && cp -Rp cont3xtbackend/* c3b \
    && cd c3b \
    && npm ci install \
    && npm audit fix --force

COPY cont3xt.conf /etc/supervisor/conf.d/
COPY c3b.conf /etc/supervisor/conf.d/

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
