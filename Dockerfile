FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm install
COPY . .
COPY .env.production .env.production
RUN npm run build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
RUN addgroup -g 1000 nginx_user && adduser -D -u 1000 -G nginx_user nginx_user
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1
CMD ["nginx", "-g", "daemon off;"]

