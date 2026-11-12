// Textos de la interfaz sobre las limitaciones conocidas del modelo 3D (src/data/limitaciones.js), en los cinco idiomas:
// la ficha de la pieza, la biblioteca de estudio y Neuri. Lo que se dice de cada pieza está en el propio registro.
// textos.js los añade a TEXTOS. Van aparte para no tocar las tablas que cambian otras ramas.
const T = (es, en, de, fr, it) => ({ es, en, de, fr, it });

export const TEXTOS_LIMITACIONES = {
  // Ficha de la pieza (ui/info.js)
  'lim.titulo': T('Limitación del modelo 3D', '3D model limitation', 'Einschränkung des 3D-Modells', 'Limite du modèle 3D', 'Limite del modello 3D'),
  'lim.estado.confirmada': T('Comprobada en el modelo el {fecha}.', 'Checked in the model on {fecha}.', 'Am {fecha} im Modell geprüft.', 'Vérifiée dans le modèle le {fecha}.', 'Verificata nel modello il {fecha}.'),
  'lim.estado.sospechosa': T('Sospecha comprobada en el modelo el {fecha}; pendiente de revisión.', 'Suspicion checked in the model on {fecha}; pending review.', 'Verdacht am {fecha} im Modell geprüft; Prüfung ausstehend.', 'Doute vérifié dans le modèle le {fecha} ; en attente de révision.', 'Sospetto verificato nel modello il {fecha}; in attesa di revisione.'),

  // Biblioteca de estudio (ui/biblioteca/)
  'bib.limite.saltada': T(
    'Esta pregunta no se hace: pide ver o tocar una pieza que el modelo muestra mal. No cuenta.',
    'This question is skipped: it needs a piece that the model shows wrongly. It does not count.',
    'Diese Frage entfällt: Sie braucht ein Teil, das das Modell falsch zeigt. Sie zählt nicht.',
    'Cette question est passée : elle demande une pièce que le modèle montre mal. Elle ne compte pas.',
    'Questa domanda viene saltata: richiede un pezzo che il modello mostra male. Non conta.'),
  'bib.limite.excluidas': T(
    ['{n} pregunta en 3D de esta lección no se hace por una limitación conocida del modelo: no cuenta ni vuelve al repaso.', '{n} preguntas en 3D de esta lección no se hacen por limitaciones conocidas del modelo: no cuentan ni vuelven al repaso.'],
    ['{n} 3D question in this lesson is not asked because of a known model limitation: it does not count and does not come back for review.', '{n} 3D questions in this lesson are not asked because of known model limitations: they do not count and do not come back for review.'],
    ['{n} 3D-Frage dieser Lektion wird wegen einer bekannten Einschränkung des Modells nicht gestellt: Sie zählt nicht und kommt nicht zur Wiederholung.', '{n} 3D-Fragen dieser Lektion werden wegen bekannter Einschränkungen des Modells nicht gestellt: Sie zählen nicht und kommen nicht zur Wiederholung.'],
    ['{n} question 3D de cette leçon n’est pas posée à cause d’une limite connue du modèle : elle ne compte pas et ne revient pas en révision.', '{n} questions 3D de cette leçon ne sont pas posées à cause de limites connues du modèle : elles ne comptent pas et ne reviennent pas en révision.'],
    ['{n} domanda in 3D di questa lezione non viene posta per un limite noto del modello: non conta e non torna nel ripasso.', '{n} domande in 3D di questa lezione non vengono poste per limiti noti del modello: non contano e non tornano nel ripasso.']),
  'bib.limite.sinEvaluar': T(
    'Sin evaluar: el modelo muestra mal lo que haría falta ver',
    'Not assessed: the model shows wrongly what would need to be seen',
    'Nicht bewertet: Das Modell zeigt falsch, was man sehen müsste',
    'Non évalué : le modèle montre mal ce qu’il faudrait voir',
    'Non valutato: il modello mostra male ciò che servirebbe vedere'),
  'bib.limite.noDemostrada': T(
    'Algún objetivo no se puede evaluar en este modelo por una limitación conocida, así que esta evaluación no demuestra la lección entera. Lo demás cuenta como siempre.',
    'Some goal cannot be assessed on this model because of a known limitation, so this assessment does not demonstrate the whole lesson. Everything else counts as usual.',
    'Ein Ziel lässt sich in diesem Modell wegen einer bekannten Einschränkung nicht bewerten, daher belegt diese Bewertung nicht die ganze Lektion. Alles andere zählt wie immer.',
    'Un objectif ne peut pas être évalué sur ce modèle à cause d’une limite connue : cette évaluation ne démontre donc pas toute la leçon. Le reste compte comme d’habitude.',
    'Un obiettivo non si può valutare su questo modello per un limite noto, quindi questa valutazione non dimostra tutta la lezione. Il resto conta come sempre.'),
  'bib.limite.evalVacia': T(
    'Esta lección no tiene preguntas que se puedan hacer en este modelo: el modelo muestra mal lo que preguntan. No se ha registrado nada.',
    'This lesson has no questions that can be asked on this model: the model shows wrongly what they ask about. Nothing was recorded.',
    'Diese Lektion hat keine Fragen, die sich in diesem Modell stellen lassen: Das Modell zeigt falsch, wonach sie fragen. Es wurde nichts gespeichert.',
    'Cette leçon n’a aucune question possible sur ce modèle : le modèle montre mal ce qu’elles demandent. Rien n’a été enregistré.',
    'Questa lezione non ha domande che si possano fare su questo modello: il modello mostra male ciò che chiedono. Non è stato registrato nulla.'),
  'bib.limite.repaso': T(
    ['{n} pregunta no se hace por una limitación conocida del modelo y no cuenta.', '{n} preguntas no se hacen por limitaciones conocidas del modelo y no cuentan.'],
    ['{n} question is not asked because of a known model limitation and does not count.', '{n} questions are not asked because of known model limitations and do not count.'],
    ['{n} Frage wird wegen einer bekannten Einschränkung des Modells nicht gestellt und zählt nicht.', '{n} Fragen werden wegen bekannter Einschränkungen des Modells nicht gestellt und zählen nicht.'],
    ['{n} question n’est pas posée à cause d’une limite connue du modèle et ne compte pas.', '{n} questions ne sont pas posées à cause de limites connues du modèle et ne comptent pas.'],
    ['{n} domanda non viene posta per un limite noto del modello e non conta.', '{n} domande non vengono poste per limiti noti del modello e non contano.']),
  'bib.limite.actividad': T(
    'Aquí no hay que tocarla: el modelo muestra mal esta pieza, así que la actividad no se corrige. Lee la limitación y sigue.',
    'No need to touch it here: the model shows this piece wrongly, so the activity is not checked. Read the limitation and go on.',
    'Hier musst du es nicht antippen: Das Modell zeigt dieses Teil falsch, deshalb wird die Aktivität nicht bewertet. Lies die Einschränkung und mach weiter.',
    'Inutile de la toucher ici : le modèle montre mal cette pièce, l’activité n’est donc pas corrigée. Lisez la limite et continuez.',
    'Qui non serve toccarlo: il modello mostra male questo pezzo, quindi l’attività non viene corretta. Leggi il limite e prosegui.'),

  // Neuri (ui/biblioteca/pet.js): lo que el validador quitó de una lección creada
  'pet.limite.quitadas': T(
    ['Se quitó {n} actividad en 3D sobre una pieza que el modelo muestra mal.', 'Se quitaron {n} actividades en 3D sobre piezas que el modelo muestra mal.'],
    ['{n} activity in 3D on a piece that the model shows wrongly was removed.', '{n} activities in 3D on pieces that the model shows wrongly were removed.'],
    ['{n} Aktivität am 3D-Modell zu einem Teil, das es falsch zeigt, wurde entfernt.', '{n} Aktivitäten am 3D-Modell zu Teilen, die es falsch zeigt, wurden entfernt.'],
    ['{n} activité 3D sur une pièce que le modèle montre mal a été retirée.', '{n} activités 3D sur des pièces que le modèle montre mal ont été retirées.'],
    ['È stata tolta {n} attività in 3D su un pezzo che il modello mostra male.', 'Sono state tolte {n} attività in 3D su pezzi che il modello mostra male.']),
};
