
# Stage 1

FROM node:latest as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install

RUN npm run build --prod

# Stage 2

FROM nginx:latest

COPY --from=build /usr/local/app/dist/battlegoal-picker /usr/share/nginx/html

EXPOSE 80