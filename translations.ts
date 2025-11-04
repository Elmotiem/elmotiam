const translations = {
  ar: {
    header: {
      subtitle: "أنشئ وعدّل الصور باستخدام الذكاء الاصطناعي",
      home: "الرئيسية",
      homeAriaLabel: "العودة للصفحة الرئيسية",
    },
    footer: {
      rights: "جميع الحقوق محفوظة لدى Mido Elmotiam",
    },
    home: {
      title: "أطلق العنان لإبداعك",
      subtitle: "اختر الأداة التي تناسب فكرتك",
      generator: {
        title: "إنشاء صورة من نص",
        description: "حول أفكارك إلى صور فنية مذهلة. فقط اكتب وصفًا ودع الخيال يصبح حقيقة.",
      },
      bgRemoval: {
        title: "إزالة الخلفية",
        description: "أزل خلفية أي صورة بنقرة واحدة مع الحفاظ على الجودة العالية والشفافية.",
      },
      editor: {
        title: "تعديل حر",
        description: "ارفع صورة وقم بإجراء تعديلات إبداعية عليها باستخدام الأوصاف النصية.",
      },
      clothesSwap: {
        title: "تغيير الملابس",
        description: "ألبس أي شخص في الصورة ملابس جديدة، سواء من صورة أخرى أو من وحي خيالك.",
      },
      imageMerge: {
        title: "دمج الصور",
        description: "اطلق العنان لخيالك بدمج عدة صور معًا لإنشاء مشاهد فريدة ومبتكرة.",
      },
      portrait: {
        title: "بورتريه فني",
        description: "حوّل صورك الشخصية إلى لوحات فنية بأنماط مختلفة: أنمي، ديزني، رسم بالفحم، والمزيد.",
      },
      moviePoster: {
        title: "بوستر فيلم",
        description: "صمم ملصق فيلم احترافي باستخدام صورك الخاصة مع إضافة النصوص والتأثيرات.",
      },
    },
    imageUploader: {
      title: "١. رفع الصورة",
      changeImage: "انقر لتغيير الصورة",
      clickToUpload: "انقر للرفع",
      orDragAndDrop: "أو قم بالسحب والإفلات",
      fileTypes: "PNG, JPG, GIF up to 10MB",
    },
    controlPanel: {
      quickIdeas: "أفكار سريعة",
      loading: "...جاري الإنشاء",
    },
    quickPrompts: {
      classic: "أضف لمسة كلاسيكية",
      removeBg: "أزل الخلفية",
      portrait: "اجعلها صورة شخصية",
      moviePoster: "حولها لملصق فيلم",
      cinematic: "أضف طابع سينمائي",
    },
    imageView: {
      download: "تحميل",
      original: "الأصلية",
      closeAriaLabel: "إغلاق",
      downloadImage: "تحميل الصورة",
      editedEmptyState: "ستظهر صورك المعدلة هنا",
      editedEmptySubtext: "ارفع صورة واكتب وصفًا للبدء.",
      generatedEmptyState: "ستظهر صورك التي تم إنشاؤها هنا",
      generatedEmptySubtext: "اكتب وصفًا في الأعلى للبدء.",
      bgRemovalEmptyState: "ستظهر صورتك بعد إزالة الخلفية هنا",
      bgRemovalEmptySubtext: "ارفع صورة للبدء.",
      clothesSwapEmptyState: "ستظهر الصورة بعد تغيير الملابس هنا",
      clothesSwapEmptySubtext: "ارفع الصور وابدأ التعديل.",
      mergeEmptyState: "نتيجة الدمج ستظهر هنا",
      mergeEmptySubtext: "ارفع صورتين على الأقل وابدأ الدمج.",
      portraitEmptyState: "النتيجة الفنية ستظهر هنا",
      portraitEmptySubtext: "ارفع صورة واختر إجراءً للبدء.",
      posterEmptyState: "بوستر الفيلم سيظهر هنا",
      posterEmptySubtext: "املأ التفاصيل واضغط تصميم للبدء.",
    },
    editor: {
      button: "إنشاء صورتين",
      promptTitle: "٢. صف التعديل المطلوب",
      placeholder: "مثال: أضف هالة سحرية متوهجة حول العنصر",
    },
    generator: {
      selectNumberTitle: "١. اختر عدد الصور",
      promptTitle: "٢. صف الصورة المطلوبة",
      placeholder: "مثال: فارس يركب تنيناً في الفضاء",
      button: "إنشاء {count} {count, plural, one {صورة} two {صورتين} few {صور} other {صور}}",
    },
    bgRemoval: {
      button: "إزالة الخلفية",
      buttonLoading: "...جاري المعالجة",
    },
    clothesSwap: {
      personImageTitle: "١. ارفع صورة الشخص",
      clothesImageTitle: "٢. ارفع صورة الملابس (اختياري)",
      promptTitle: "٣. أو صف الملابس",
      placeholder: "مثال: اجعله يرتدي سترة جلدية سوداء",
      button: "تغيير الملابس",
    },
    imageMerge: {
      image1: "الصورة الأولى",
      image2: "الصورة الثانية",
      image3: "الصورة الثالثة",
      promptTitle: "صف كيف تدمج الصور",
      placeholder: "مثال: اجعل الشخص في الصورة الأولى يقف في المشهد من الصورة الثانية...",
      button: "دمج الصور",
    },
    portrait: {
      uploadTitle: "١. ارفع صورة شخصية",
      styleTitle: "٢. اختر الإجراء المطلوب",
      stylePlaceholder: "اختر إجراءً...",
      button: "تطبيق الإجراء",
      buttonLoading: "...جاري التحويل",
      EnhanceQuality: {
          name: 'تحسين الجودة',
          description: 'زيادة دقة ووضوح الصورة تلقائيًا.'
      },
      RestorePhoto: {
          name: 'ترميم الصور القديمة',
          description: 'إصلاح الخدوش واستعادة الألوان للصور الباهتة.'
      },
      Anime: {
          name: 'أنمي',
          description: 'أسلوب الرسوم المتحركة اليابانية.'
      },
      Disney: {
          name: 'ديزني',
          description: 'نمط كرتوني ساحر ومحبوب.'
      },
      CharcoalSketch: {
          name: 'رسم بالفحم',
          description: 'تأثير فني داكن ومعبر.'
      },
      PencilDrawing: {
          name: 'رسم بالرصاص',
          description: 'تخطيطات دقيقة وتظليل ناعم.'
      },
      AbstractArt: {
          name: 'فن تجريدي',
          description: 'تحويل الصورة إلى تكوين من الأشكال والألوان.'
      },
      PopArt: {
          name: 'فن البوب',
          description: 'أسلوب فني جريء بألوان زاهية مستوحى من الستينات.'
      },
    },
    moviePoster: {
        image1: 'الصورة الأساسية الأولى (اختياري)',
        image2: 'الصورة الأساسية الثانية (اختياري)',
        image3: 'الصورة الأساسية الثالثة (اختياري)',
        detailsTitle: 'تفاصيل الفيلم',
        titlePlaceholder: 'عنوان الفيلم (مطلوب)',
        descriptionPlaceholder: 'وصف الفيلم / شعار',
        actorsPlaceholder: 'الأبطال',
        directorPlaceholder: 'المخرج',
        writerPlaceholder: 'المؤلف',
        genrePlaceholder: 'نوع الفيلم (أكشن، كوميدي...)',
        button: 'تصميم البوستر',
        buttonLoading: '...جاري التصميم',
    },
    dropdown: {
        placeholder: "اختر...",
    },
    toast: {
      error: {
        uploadFirst: 'الرجاء رفع صورة أولاً.',
        enterDescription: 'الرجاء إدخال وصف للتعديل.',
        creationFailed: 'فشل إنشاء الصور. الرجاء المحاولة مرة أخرى.',
        enterPrompt: 'الرجاء إدخال وصف لإنشاء الصورة.',
        bgRemovalFailed: 'فشل في إزالة الخلفية. الرجاء المحاولة مرة أخرى.',
        uploadPersonImage: 'الرجاء رفع صورة الشخص أولاً.',
        uploadOrDescribeClothes: 'الرجاء رفع صورة للملابس أو كتابة وصف لها.',
        clothesSwapFailed: 'فشل تغيير الملابس. الرجاء المحاولة مرة أخرى.',
        uploadTwoImages: 'الرجاء رفع صورتين على الأقل للدمج.',
        enterMergeDescription: 'الرجاء كتابة وصف لكيفية دمج الصور.',
        mergeFailed: 'فشل دمج الصور. الرجاء المحاولة مرة أخرى.',
        selectStyle: 'الرجاء اختيار نمط فني.',
        portraitFailed: 'فشل إنشاء البورتريه. الرجاء المحاولة مرة أخرى.',
        movieTitleRequired: 'عنوان الفيلم حقل مطلوب.',
        posterFailed: 'فشل تصميم البوستر. الرجاء المحاولة مرة أخرى.',
        invalidImageFile: 'الرجاء اختيار ملف صورة صالح.',
        fileReadFailed: 'فشل في قراءة ملف الصورة.',
        quotaExceeded: 'لقد تجاوزت الحصة المسموح بها. الرجاء المحاولة مرة أخرى لاحقاً.',
        quotaExceededRetry: 'لقد تجاوزت الحصة المسموح بها. الرجاء المحاولة مرة أخرى خلال {time}.',
      },
      success: {
        imagesCreated: 'تم إنشاء الصور بنجاح!',
        bgRemoved: 'تمت إزالة الخلفية بنجاح!',
        clothesSwapped: 'تم تغيير الملابس بنجاح!',
        imagesMerged: 'تم دمج الصور بنجاح!',
        portraitCreated: 'تم إنشاء البورتريه بنمط {style} بنجاح!',
        posterCreated: 'تم تصميم بوستر الفيلم بنجاح!',
      }
    }
  },
  en: {
    header: {
      subtitle: "Create and edit images with AI",
      home: "Home",
      homeAriaLabel: "Return to Home Page",
    },
    footer: {
      rights: "All rights reserved by Mido Elmotiam",
    },
    home: {
      title: "Unleash Your Creativity",
      subtitle: "Choose the tool that fits your idea",
      generator: {
        title: "Create Image from Text",
        description: "Turn your ideas into stunning images. Just type a description and let imagination become reality.",
      },
      bgRemoval: {
        title: "Background Removal",
        description: "Remove the background of any image with one click, maintaining high quality and transparency.",
      },
      editor: {
        title: "Freestyle Edit",
        description: "Upload an image and make creative edits using text descriptions.",
      },
      clothesSwap: {
        title: "Change Clothes",
        description: "Dress anyone in a photo in new clothes, either from another picture or from your imagination.",
      },
      imageMerge: {
        title: "Merge Images",
        description: "Unleash your imagination by merging several images together to create unique and innovative scenes.",
      },
      portrait: {
        title: "Artistic Portrait",
        description: "Transform your portraits into artworks in different styles: anime, Disney, charcoal sketch, and more.",
      },
      moviePoster: {
        title: "Movie Poster",
        description: "Design a professional movie poster using your own photos with added text and effects.",
      },
    },
    imageUploader: {
      title: "1. Upload Image",
      changeImage: "Click to change image",
      clickToUpload: "Click to upload",
      orDragAndDrop: "or drag and drop",
      fileTypes: "PNG, JPG, GIF up to 10MB",
    },
    controlPanel: {
      quickIdeas: "Quick Ideas",
      loading: "...Generating",
    },
    quickPrompts: {
      classic: "Add a classic touch",
      removeBg: "Remove background",
      portrait: "Make it a portrait",
      moviePoster: "Turn into a movie poster",
      cinematic: "Add a cinematic feel",
    },
    imageView: {
      download: "Download",
      original: "Original",
      closeAriaLabel: "Close",
      downloadImage: "Download Image",
      editedEmptyState: "Your edited images will appear here",
      editedEmptySubtext: "Upload an image and write a description to get started.",
      generatedEmptyState: "Your generated images will appear here",
      generatedEmptySubtext: "Write a description above to get started.",
      bgRemovalEmptyState: "Your image without a background will appear here",
      bgRemovalEmptySubtext: "Upload an image to get started.",
      clothesSwapEmptyState: "The image with changed clothes will appear here",
      clothesSwapEmptySubtext: "Upload images and start editing.",
      mergeEmptyState: "The merged result will appear here",
      mergeEmptySubtext: "Upload at least two images and start merging.",
      portraitEmptyState: "The artistic result will appear here",
      portraitEmptySubtext: "Upload an image and choose an action to get started.",
      posterEmptyState: "The movie poster will appear here",
      posterEmptySubtext: "Fill in the details and click design to start.",
    },
    editor: {
      button: "Create 2 Images",
      promptTitle: "2. Describe the desired edit",
      placeholder: "Example: Add a magical glowing aura around the element",
    },
    generator: {
      selectNumberTitle: "1. Select number of images",
      promptTitle: "2. Describe the desired image",
      placeholder: "Example: A knight riding a dragon in space",
      button: "Create {count} {count, plural, one {Image} other {Images}}",
    },
    bgRemoval: {
      button: "Remove Background",
      buttonLoading: "...Processing",
    },
    clothesSwap: {
      personImageTitle: "1. Upload person's image",
      clothesImageTitle: "2. Upload clothes image (optional)",
      promptTitle: "3. Or describe the clothes",
      placeholder: "Example: Make him wear a black leather jacket",
      button: "Change Clothes",
    },
    imageMerge: {
      image1: "First Image",
      image2: "Second Image",
      image3: "Third Image",
      promptTitle: "Describe how to merge the images",
      placeholder: "Example: Make the person in the first image stand in the scene from the second image...",
      button: "Merge Images",
    },
    portrait: {
      uploadTitle: "1. Upload a portrait",
      styleTitle: "2. Choose the desired action",
      stylePlaceholder: "Choose an action...",
      button: "Apply Action",
      buttonLoading: "...Transforming",
      EnhanceQuality: {
          name: 'Enhance Quality',
          description: 'Automatically increase image resolution and clarity.'
      },
      RestorePhoto: {
          name: 'Restore Old Photos',
          description: 'Fix scratches and restore colors for faded photos.'
      },
      Anime: {
          name: 'Anime',
          description: 'Japanese animation style.'
      },
      Disney: {
          name: 'Disney',
          description: 'A magical and beloved cartoon style.'
      },
      CharcoalSketch: {
          name: 'Charcoal Sketch',
          description: 'A dark and expressive artistic effect.'
      },
      PencilDrawing: {
          name: 'Pencil Drawing',
          description: 'Fine lines and soft shading.'
      },
      AbstractArt: {
          name: 'Abstract Art',
          description: 'Transform the image into a composition of shapes and colors.'
      },
      PopArt: {
          name: 'Pop Art',
          description: 'A bold art style with bright colors inspired by the 60s.'
      },
    },
    moviePoster: {
        image1: 'First main image (optional)',
        image2: 'Second main image (optional)',
        image3: 'Third main image (optional)',
        detailsTitle: 'Movie Details',
        titlePlaceholder: 'Movie Title (required)',
        descriptionPlaceholder: 'Movie Description / Tagline',
        actorsPlaceholder: 'Starring',
        directorPlaceholder: 'Director',
        writerPlaceholder: 'Writer',
        genrePlaceholder: 'Genre (Action, Comedy...)',
        button: 'Design Poster',
        buttonLoading: '...Designing',
    },
    dropdown: {
        placeholder: "Select...",
    },
    toast: {
      error: {
        uploadFirst: "Please upload an image first.",
        enterDescription: "Please enter a description for the edit.",
        creationFailed: "Failed to create images. Please try again.",
        enterPrompt: "Please enter a prompt to create the image.",
        bgRemovalFailed: "Failed to remove background. Please try again.",
        uploadPersonImage: "Please upload the person's image first.",
        uploadOrDescribeClothes: "Please upload a clothing image or describe it.",
        clothesSwapFailed: "Failed to swap clothes. Please try again.",
        uploadTwoImages: "Please upload at least two images to merge.",
        enterMergeDescription: "Please write a description of how to merge the images.",
        mergeFailed: "Failed to merge images. Please try again.",
        selectStyle: "Please select an artistic style.",
        portraitFailed: "Failed to create the portrait. Please try again.",
        movieTitleRequired: "Movie title is a required field.",
        posterFailed: "Failed to design the poster. Please try again.",
        invalidImageFile: "Please select a valid image file.",
        fileReadFailed: "Failed to read the image file.",
        quotaExceeded: 'You have exceeded your quota. Please try again later.',
        quotaExceededRetry: 'You have exceeded your quota. Please try again in {time}.',
      },
      success: {
        imagesCreated: "Images created successfully!",
        bgRemoved: "Background removed successfully!",
        clothesSwapped: "Clothes swapped successfully!",
        imagesMerged: "Images merged successfully!",
        portraitCreated: "Portrait created in {style} style successfully!",
        posterCreated: "Movie poster designed successfully!",
      }
    }
  }
};

export default translations;