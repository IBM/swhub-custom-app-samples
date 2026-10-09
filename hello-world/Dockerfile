FROM registry.access.redhat.com/ubi9/ubi-minimal
USER 0
RUN microdnf update -y && microdnf install python3 python3-pip openssl -y \
    && pip3 install flask \
    && microdnf clean all
WORKDIR /app
COPY app.py .
COPY generate-certs.sh .
RUN bash -x generate-certs.sh
RUN chmod 644 cert.pem key.pem
RUN chmod 666 app.py
USER 1001

CMD ["python3", "app.py"] 
