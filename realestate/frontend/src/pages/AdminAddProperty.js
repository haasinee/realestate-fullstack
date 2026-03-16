import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProperty, updateProperty, getProperty, uploadImage } from '../services/api';
import { useToast } from '../components/Toast';
import AddPropertyForm from '../components/AddPropertyForm';

const EMPTY = {
  propertyName: '',
  title: '',
  description: '',
  price: '',
  location: '',
  imageUrl: '',
  latitude: '',
  longitude: '',
  propertyType: 'APARTMENT',
  isFeatured: false,
};

export default function AdminAddProperty() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const showToast = useToast();

  const [form, setForm] = useState(EMPTY);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    getProperty(id)
      .then((res) => {
        const p = res.data;
        setForm({
          propertyName: p.propertyName || p.title || '',
          title: p.title || '',
          description: p.description || '',
          price: p.price || '',
          location: p.location || p.city || '',
          imageUrl: p.imageUrl || '',
          latitude: p.latitude || '',
          longitude: p.longitude || '',
          propertyType: p.propertyType || 'APARTMENT',
          isFeatured: !!p.isFeatured,
        });
      })
      .catch(() => {
        showToast('Failed to load property', 'error');
        navigate('/admin/properties');
      });
  }, [id, isEdit, navigate, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        title: form.title || form.propertyName,
        price: Number(form.price),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      };

      const saved = isEdit ? await updateProperty(id, payload) : await createProperty(payload);
      const savedId = saved.data.id;

      let primaryImageUrl = form.imageUrl;
      for (let i = 0; i < imageFiles.length; i++) {
        const fd = new FormData();
        fd.append('file', imageFiles[i]);
        fd.append('isPrimary', i === 0);
        const uploaded = await uploadImage(savedId, fd);
        if (i === 0) {
          primaryImageUrl = uploaded.data.imageUrl;
        }
      }

      if (primaryImageUrl && primaryImageUrl !== form.imageUrl) {
        await updateProperty(savedId, { ...payload, imageUrl: primaryImageUrl });
      }

      showToast(isEdit ? 'Property updated successfully!' : 'Property created successfully!');
      navigate('/admin/properties');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save property', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 400 }}>{isEdit ? 'Edit Property' : 'Add New Property'}</h2>
      </div>
      <AddPropertyForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        loading={loading}
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
        submitLabel={isEdit ? 'Update Property' : 'Create Property'}
      />
    </div>
  );
}
