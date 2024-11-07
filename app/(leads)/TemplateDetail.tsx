import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import RenderHTML, { HTMLElementModel, HTMLContentModel, defaultHTMLElementModels, CustomRendererProps } from 'react-native-render-html';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { ColorsNative } from '@/constants/Colors';
import { useGlobalSearchParams } from 'expo-router';
import { fetchTemplateById } from '@/redux/slices/sendgrid/sendgridSlice';

// Renderizador de imágenes personalizado
const CustomImageRenderer = ({ tnode, style }: CustomRendererProps<any>) => {
  const { width } = useWindowDimensions();
  const maxImageWidth = width * 0.9; // Usamos el 90% del ancho de la pantalla
  const aspectRatio = tnode.attributes.width && tnode.attributes.height
    ? Number(tnode.attributes.width) / Number(tnode.attributes.height)
    : 1.5; // Relación de aspecto predeterminada si no hay atributos

  return (
    <Image
      source={{ uri: tnode.attributes.src }}
      style={[style, { width: maxImageWidth, height: maxImageWidth / aspectRatio }]}
      resizeMode="contain"
    />
  );
};

const TemplateDetail: React.FC = () => {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { template, loading, error } = useAppSelector((state) => state.sendgrid);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (id) {
      dispatch(fetchTemplateById(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ColorsNative.primary[100]} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const htmlContent = template?.versions[0]?.html_content || '<p>Contenido no disponible</p>';

  const customHTMLElementModels = {
    center: HTMLElementModel.fromCustomModel({
      tagName: 'center',
      contentModel: HTMLContentModel.block,
      mixedUAStyles: { alignItems: 'center', justifyContent: 'center', display: 'flex' },
    }),
    ...defaultHTMLElementModels,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{template?.name}</Text>
      <Text style={styles.subtitle}>ID: {template?.id}</Text>
      <Text style={styles.subtitle}>Última actualización: {template?.updated_at}</Text>

      {template?.versions.length! > 0 && (
        <>
          <Image
            source={{ uri: `https:${template?.versions[0].thumbnail_url}` }}
            style={styles.thumbnail}
            resizeMode="contain"
          />
          <Text style={styles.versionTitle}>Versión: {template?.versions[0].name}</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.htmlTitle}>Vista previa del contenido HTML:</Text>
            <RenderHTML
              contentWidth={width * 0.9}
              source={{ html: htmlContent }}
              tagsStyles={htmlStyles}
              customHTMLElementModels={customHTMLElementModels}
              renderers={{
                img: CustomImageRenderer, // Renderizador personalizado para <img>
              }}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: ColorsNative.background[100],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: ColorsNative.options.red,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ColorsNative.text[100],
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: ColorsNative.text[300],
    marginBottom: 5,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 20,
  },
  versionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ColorsNative.text[200],
    marginBottom: 10,
  },
  contentContainer: {
    backgroundColor: ColorsNative.background[200],
    padding: 15,
    borderRadius: 8,
  },
  htmlTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorsNative.text[100],
    marginBottom: 5,
  },
});

const htmlStyles = {
  p: {
    color: ColorsNative.text[300],
    fontSize: 16,
    lineHeight: 24,
  },
  h1: {
    color: ColorsNative.primary[100],
    fontSize: 24,
    fontWeight: '700' as '700',
  },
  a: {
    color: ColorsNative.primary[200],
    textDecorationLine: 'underline' as const,
  },
};

export default TemplateDetail;
