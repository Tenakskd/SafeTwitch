# Multi-stage
# 1) Node image for building frontend assets
# 2) nginx stage to serve frontend assets

# Name the node stage "builder"
FROM docker.io/node:16 AS builder
# Set working directory
WORKDIR /app


# Filled with placeholders, later changed and managed
# by the substitute_environment_variables.sh file
ENV SAFETWITCH_BACKEND_DOMAIN SAFETWITCH_BACKEND_DOMAIN_PLACEHOLDER
ENV SAFETWITCH_INSTANCE_DOMAIN SAFETWITCH_INSTANCE_DOMAIN_PLACEHOLDER
ENV SAFETWITCH_HTTPS SAFETWITCH_HTTPS_PLACEHOLDER
ENV SAFETWITCH_DEFAULT_LOCALE SAFETWITCH_DEFAULT_LOCALE_PLACEHOLDER
ENV SAFETWITCH_FALLBACK_LOCALE SAFETWITCH_FALLBACK_LOCALE_PLACEHOLDER
ENV SAFETWITCH_DEFAULT_THEME SAFETWITCH_DEFAULT_THEME_PLACEHOLDER


# Copy all files from current directory to working dir in image
COPY ./ .

RUN ls
# install node modules and build assets
RUN npm i && npm run build

# nginx state for serving content
FROM docker.io/nginx:alpine
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
# Set working directory to nginx asset directory
RUN mkdir /app
# Copy static assets from builder stage
COPY --from=builder /app/dist /app
# Containers run nginx with global directives and daemon off
EXPOSE 8280

# Overriding the default NGINX container behavior
COPY ./docker/substitute_environment_variables.sh ./substitute_environment_variables.sh
RUN chmod +x /substitute_environment_variables.sh
ENTRYPOINT ["/substitute_environment_variables.sh"]