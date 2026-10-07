#!/bin/bash

# 1. Kiểm tra tham số truyền vào
if [ -z "$1" ] || [ ! -d "$1" ]; then
    echo "Loi: Thieu tham so hoac thu muc khong ton tai!"
    exit 1
fi

TARGET_DIR="$1"
DIR_NAME=$(basename "$TARGET_DIR")
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$HOME/backup"
BACKUP_FILE="$BACKUP_DIR/${DIR_NAME}_${TIMESTAMP}.tar.gz"

# 2. Tạo thư mục ~/backup nếu chưa có
mkdir -p "$BACKUP_DIR"

# 3. Nén thư mục thành file .tar.gz
tar -czf "$BACKUP_FILE" -C "$(dirname "$TARGET_DIR")" "$DIR_NAME"

# 4. Ghi nhật ký vào logs/backup.log
LOG_FILE="$HOME/dg1_2412111032/logs/backup.log"
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Backup $TARGET_DIR -> $BACKUP_FILE" >> "$LOG_FILE"

echo "Sao luu thanh cong: $BACKUP_FILE"
