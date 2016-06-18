from rest_assured.testcases import ReadWriteRESTAPITestCaseMixin


class SerializerRESTAPITestCaseMixin(object):
    serializer_class = None

    def get_serializer_class(self):
        """Return the serializer class for this test case.

        :returns: Serializer class used for creating json objects.
        """

        return getattr(self, 'serializer_class')

    def test_serializer(self):
        """
        Ensure we have the correct required fields for a country object (name).
        """
        serializer = self.get_serializer_class()(data=self.get_create_data())
        is_valid = serializer.is_valid()
        self.assertTrue(is_valid, serializer.errors)


class SerializerRWRESTAPITestCaseMixin(ReadWriteRESTAPITestCaseMixin, SerializerRESTAPITestCaseMixin):
    pass


class MascrefAPITestCase(SerializerRWRESTAPITestCaseMixin):
    pass


class MascrefModelTestCase(object):
    verbose_name_plural = None
    model_class = None
    object = None

    def get_verbose_name_plural(self):
        """Return the verbose name of the class for plural.

        :returns: String with the verbose name.
        """

        return getattr(self, 'verbose_name_plural')

    def get_model_class(self):
        """Return the model class with create data for this test case.

        :returns: Model class used for creating the object.
        """

        return getattr(self, 'model_class')

    def get_object(self):
        """Return the instance object for this test case.

        :returns: Instance of the model used for creating the object.
        """

        return getattr(self, 'object')

    def setUp(self):
        model = self.get_object()
        # model.save()
        # print model.pk
        self.pk = model.pk

# Basic tests
    # def test_string_representation(self):
    #     obj = self.get_model_class().objects.get(pk=self.pk)
    #     print type(str(obj))
    #     self.assertTrue(isinstance(obj, self.get_model_class()))

    def test_verbose_name_plural(self):
        self.assertEqual(str(self.get_model_class()._meta.verbose_name_plural),
                         self.get_verbose_name_plural())
