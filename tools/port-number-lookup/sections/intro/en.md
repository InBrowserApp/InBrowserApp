## What is a Port Number?

A port number is a 16-bit unsigned integer (0-65535) used to identify
specific processes or services on a networked device. Ports allow multiple
network services to run on the same IP address.

### System Ports (0-1023)

Also called "well-known ports", reserved for common services like HTTP (80),
HTTPS (443), SSH (22).

### Registered Ports (1024-49151)

Used by applications and services registered with IANA, such as MySQL
(3306), PostgreSQL (5432).

### Dynamic Ports (49152-65535)

Also called "ephemeral ports", used for temporary connections by client
applications.
