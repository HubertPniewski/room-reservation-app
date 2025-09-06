import os
from django.core.management.base import BaseCommand
from django.conf import settings
from listings.models import RentObjectImage


class Command(BaseCommand):
    help = "Delete orphaned image files not referenced in the database"

    def handle(self, *args, **options):
        media_root = settings.MEDIA_ROOT
        if not media_root:
            self.stdout.write(self.style.ERROR("MEDIA_ROOT is not defined"))
            return
        
        # collect all files referenced in the database
        used_files = set()
        for img in RentObjectImage.objects.all():
          if img.image:
                used_files.add(img.image.path)

        deleted_count = 0 
        # delete from MEDIA_ROOT files not in database
        for dirpath, dirnames, filenames in os.walk(media_root):
            for filename in filenames:
                file_path = os.path.join(dirpath, filename)
                if file_path not in used_files:
                    try:
                        os.remove(file_path)
                        deleted_count += 1
                        self.stdout.write(self.style.SUCCESS(f"Deleted orphan: {file_path}"))
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"Error deleting {file_path}: {e}"))
        
        self.stdout.write(self.style.SUCCESS(f"Done. {deleted_count} orphaned files removed."))