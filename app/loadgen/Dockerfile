FROM alpine
RUN apk add --no-cache curl coreutils
COPY run.sh .
ENV URL="http://frontend:4000/"
CMD ["./run.sh"]
