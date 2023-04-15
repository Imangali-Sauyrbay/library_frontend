FROM node:18.14.2-alpine3.17 as build

WORKDIR /app

COPY . .

RUN npm i \
    && npm run build

FROM nginx:stable-alpine as nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]