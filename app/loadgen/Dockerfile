FROM alpine
RUN apk add --no-cache curl coreutils
COPY run.sh .
ENV URL="http://frontend:3000/"
CMD ["./run.sh"]
